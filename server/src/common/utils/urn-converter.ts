import { Buffer } from 'buffer';

export class UrnConverter {
  static encode(url: string): string {
    return Buffer.from(url).toString('base64').split('=')[0];
  }

  static decode(urn: string): string {
    return Buffer.from(urn, 'base64').toString('ascii');
  }
}
