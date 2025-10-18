export default {
  port: parseInt(process.env.PORT ?? "4001", 10),
  AUTODESK_OSS_BASE_URL: process.env.AUTODESK_OSS_BASE_URL || 'https://developer.api.autodesk.com/oss/v2',
  FORGE_CLIENT_ID: process.env.FORGE_CLIENT_ID,
  FORGE_CLIENT_SECRET: process.env.FORGE_CLIENT_SECRET,
}