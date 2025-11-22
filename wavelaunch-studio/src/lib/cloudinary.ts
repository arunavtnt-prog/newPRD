/**
 * Cloudinary Service
 *
 * Handles file uploads to Cloudinary cloud storage
 */

import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface UploadOptions {
  folder?: string;
  resourceType?: 'image' | 'video' | 'raw' | 'auto';
  transformation?: any[];
  format?: string;
  publicId?: string;
}

interface UploadResult {
  url: string;
  secureUrl: string;
  publicId: string;
  format: string;
  resourceType: string;
  width?: number;
  height?: number;
  bytes: number;
  thumbnailUrl?: string;
}

/**
 * Check if Cloudinary is properly configured
 */
export function isCloudinaryConfigured(): boolean {
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}

/**
 * Upload a file buffer to Cloudinary
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  options: UploadOptions = {}
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || 'wavelaunch-studio',
        resource_type: options.resourceType || 'auto',
        transformation: options.transformation,
        format: options.format,
        public_id: options.publicId,
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
          return;
        }

        if (!result) {
          reject(new Error('Upload failed: No result returned'));
          return;
        }

        // Generate thumbnail for images
        let thumbnailUrl: string | undefined;
        if (result.resource_type === 'image') {
          thumbnailUrl = cloudinary.url(result.public_id, {
            width: 300,
            height: 300,
            crop: 'fill',
            quality: 'auto',
            fetch_format: 'auto',
          });
        }

        resolve({
          url: result.url,
          secureUrl: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          resourceType: result.resource_type,
          width: result.width,
          height: result.height,
          bytes: result.bytes,
          thumbnailUrl,
        });
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Upload from base64 data
 */
export async function uploadBase64ToCloudinary(
  base64Data: string,
  options: UploadOptions = {}
): Promise<UploadResult> {
  try {
    const result = await cloudinary.uploader.upload(base64Data, {
      folder: options.folder || 'wavelaunch-studio',
      resource_type: options.resourceType || 'auto',
      transformation: options.transformation,
      format: options.format,
      public_id: options.publicId,
    });

    // Generate thumbnail for images
    let thumbnailUrl: string | undefined;
    if (result.resource_type === 'image') {
      thumbnailUrl = cloudinary.url(result.public_id, {
        width: 300,
        height: 300,
        crop: 'fill',
        quality: 'auto',
        fetch_format: 'auto',
      });
    }

    return {
      url: result.url,
      secureUrl: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      resourceType: result.resource_type,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
      thumbnailUrl,
    };
  } catch (error) {
    console.error('Cloudinary base64 upload error:', error);
    throw error;
  }
}

/**
 * Delete a file from Cloudinary
 */
export async function deleteFromCloudinary(
  publicId: string,
  resourceType: 'image' | 'video' | 'raw' = 'image'
): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result.result === 'ok';
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return false;
  }
}

/**
 * Get optimized image URL with transformations
 */
export function getOptimizedImageUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
    format?: string;
  } = {}
): string {
  return cloudinary.url(publicId, {
    width: options.width,
    height: options.height,
    crop: options.crop || 'fill',
    quality: options.quality || 'auto',
    fetch_format: options.format || 'auto',
  });
}

/**
 * Generate a thumbnail URL
 */
export function getThumbnailUrl(publicId: string, size: number = 300): string {
  return cloudinary.url(publicId, {
    width: size,
    height: size,
    crop: 'fill',
    quality: 'auto',
    fetch_format: 'auto',
  });
}

export { cloudinary };
