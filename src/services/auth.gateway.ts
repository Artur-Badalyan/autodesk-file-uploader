/* eslint-disable camelcase */
import fetch from 'node-fetch';
import { IAuthGateway } from '../interfaces';
// import { ForgeGatewayError } from './forge-gateway-error';

export class AuthGateway implements IAuthGateway {
  async fetchToken(scopes: string): Promise<Error | string> {
    const request = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${btoa(`${this.#clientId}:${this.#clientSecret}`)}`,
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        scope: scopes,
      }),
    };

    const response = await fetch(this.#url, request).catch((error) => error);
    if (response instanceof Error) return response;
    const status = response.status;
    const result = await response.json().catch((e) => {
      return undefined;
    });

    const source = 'get_token';
    // const error = ForgeGatewayError.authentication[status];

    // if (status === 400) {
    //   return ForgeGatewayError.BadRequest(source, error, result);
    // } else if (status === 401) {
    //   return ForgeGatewayError.Unauthorized(source, error, result);
    // } else if (status === 403) {
    //   return ForgeGatewayError.Forbidden(source, error, result);
    // } else if (status === 429) {
    //   return ForgeGatewayError.TooManyRequests(source, error, result);
    // } else if (status >= 400) {
    //   return ForgeGatewayError.Internal(source, result);
    // }

    const { access_token, token_type } = result;

    return this.#makeFullToken(token_type, access_token);
  }

  #url = 'https://developer.api.autodesk.com/authentication/v2/token';
  #clientId = process.env.FORGE_CLIENT_ID;
  #clientSecret = process.env.FORGE_CLIENT_SECRET;

  #makeFullToken(token_type, access_token) {
    return `${token_type} ${access_token}`;
  }
}
