export const TAuthGateway = Symbol('IAuthGateway');

export interface IAuthGateway {
  fetchToken(scopes: string): Promise<Error | string>;
}
