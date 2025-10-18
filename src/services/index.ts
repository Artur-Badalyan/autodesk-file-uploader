/* eslint-disable camelcase */
import fetch from 'node-fetch';
import fs from 'fs/promises';
import FormData from 'form-data';
import { Injectable } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';

import { AuthGateway } from './auth.gateway';
import { randomUUID } from 'crypto';

interface IRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: Record<string, any> | URLSearchParams | string;
  queryParams?: Record<string, string | number>;
}

@Injectable()
export class ForgeService {
  private authGateway = new AuthGateway();

  async makeRequest(
    endpoint: string,
    scopes: string,
    options: IRequestOptions = {},
    baseUrl: string = process.env.AUTODESK_OSS_BASE_URL ?? ''
  ): Promise<any> {
    try {
      const tokenOrError = await this.authGateway.fetchToken(scopes);
      if (tokenOrError instanceof Error) throw tokenOrError;
      const authToken = tokenOrError;

      let url = `${baseUrl}/${endpoint}`;
      if (options.queryParams) {
        const params = new URLSearchParams(
          Object.entries(options.queryParams).map(([k, v]) => [k, String(v)])
        );
        url += `?${params.toString()}`;
      }

      const headers: Record<string, string> = {
        Authorization: authToken,
        'Content-Type': 'application/json',
        ...options.headers,
      };

      const fetchOptions: any = {
        method: options.method || 'GET',
        headers,
      };

      if (options.body) {
        if (
          options.body instanceof URLSearchParams ||
          typeof options.body === 'string'
        ) {
          fetchOptions.body = options.body;
        } else {
          fetchOptions.body = JSON.stringify(options.body);
        }
      }

      console.log('!!! fetchOptions', fetchOptions);
      console.log('!!! url', url);
      const response = await fetch(url, fetchOptions);
      const result = await response.json().catch(() => undefined);
      if (!response.ok) {
        throw new Error(
          `Forge API Error ${response.status}: ${JSON.stringify(result)}`
        );
      }

      return result;
    } catch (error) {
      return error;
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<any> {
    const fileName = `${randomUUID()}_${file.originalname}`;

    try {
      // 1. Get signed S3 upload key
      const bucketResponse = await this.getSignedUploadKey(fileName);

      // 2. Read file into buffer
      const fileBuffer = await fs.readFile(file.path);

      // 3. Upload file to S3
      await this.uploadToS3(bucketResponse.urls[0], fileBuffer);

      // 4. Complete the upload in Autodesk
      const result = await this.completeUpload(
        bucketResponse.uploadKey,
        fileName
      );

      return result;
    } catch (error) {
      throw error instanceof HttpException
        ? error
        : new HttpException(error?.message || 'Upload failed', 500);
    } finally {
      await this.cleanupFile(file.path);
    }
  }

  private async getSignedUploadKey(fileName: string) {
    const response = await this.makeRequest(
      `buckets/${process.env.FILE_BUCKET_NAME}/objects/${fileName}/signeds3upload?minutesExpiration=60`,
      'data:write data:create'
    );

    if (response instanceof Error) throw response;
    if (!response?.uploadKey || !response?.urls?.length) {
      throw new HttpException('Failed to get signed URL for upload', 500);
    }

    return response;
  }

  private async uploadToS3(url: string, buffer: Buffer) {
    const res = await fetch(url, {
      method: 'PUT',
      body: buffer,
    });

    if (!res.ok) {
      throw new HttpException(
        `Upload to S3 failed with status ${res.status}`,
        res.status
      );
    }
  }

  private async completeUpload(uploadKey: string, fileName: string) {
    const tokenOrError = await this.authGateway.fetchToken(
      'data:write data:create'
    );
    if (tokenOrError instanceof Error) throw tokenOrError;

    const signedUrl = `${process.env.AUTODESK_OSS_BASE_URL}/buckets/${process.env.FILE_BUCKET_NAME}/objects/${fileName}/signeds3upload`;
    const res = await fetch(signedUrl, {
      method: 'POST',
      headers: {
        Authorization: tokenOrError,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uploadKey }),
    });
    if (!res.ok) {
      throw new HttpException(
        `Completing upload failed with status ${res.status}`,
        res.status
      );
    }

    return res.json();
  }

  private async cleanupFile(filePath: string) {
    try {
      await fs.unlink(filePath);
    } catch {
      // Log or ignore, non-critical cleanup
    }
  }
}
