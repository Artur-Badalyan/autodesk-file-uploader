import { Controller, Get, Post, Put, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { QueryBus, CommandBus } from '@nestjs/cqrs';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { randomUUID } from 'crypto';

import { ListBucketObjectsQuery } from './queries/files.handler.js';
import { ConvertFileCommand, UploadFileCommand } from './command/files.handler.js';


@Controller('files')
export class BucketsController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}
  
  @Get('/objects')
  async listObjects() {
    return this.queryBus.execute(new ListBucketObjectsQuery());
  }

  @Post('/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: path.resolve(__dirname, '..', '..', 'markupFiles'),
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.commandBus.execute(new UploadFileCommand(file));
  }

  @Put('/convert')
  async convertFile(@Query('urn') urn: string) {
    return this.commandBus.execute(new ConvertFileCommand(urn));
  }



}
