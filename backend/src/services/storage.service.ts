import { logger } from '../utils/logger';

export interface UploadResult {
  key: string;
  url: string;
  size: number;
  mimeType: string;
}

export async function uploadFile(
  _buffer: Buffer,
  key: string,
  mimeType: string,
  size: number
): Promise<UploadResult> {
  logger.info(`[Storage Stub] File uploaded: ${key}`);
  return {
    key,
    url: `https://storage.smartshetkari.app/${key}`,
    size,
    mimeType,
  };
}

export async function getPresignedUrl(key: string): Promise<string> {
  return `https://storage.smartshetkari.app/${key}`;
}

export async function deleteFile(key: string): Promise<void> {
  logger.info(`[Storage Stub] File deleted: ${key}`);
}
