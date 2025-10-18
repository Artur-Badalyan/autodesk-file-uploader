import { Buffer } from 'buffer';
export const toUrn = (string) =>
  Buffer.from(string).toString('base64').split('=')[0];
