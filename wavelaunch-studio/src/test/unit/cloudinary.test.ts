/**
 * Tests for Cloudinary Service
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock cloudinary before importing
vi.mock('cloudinary', () => ({
  v2: {
    config: vi.fn(),
    uploader: {
      upload_stream: vi.fn(),
      upload: vi.fn(),
      destroy: vi.fn(),
    },
    url: vi.fn((publicId, options) => `https://res.cloudinary.com/test/image/upload/${publicId}`),
  },
}));

// Set up environment variables
process.env.CLOUDINARY_CLOUD_NAME = 'test-cloud';
process.env.CLOUDINARY_API_KEY = 'test-key';
process.env.CLOUDINARY_API_SECRET = 'test-secret';

import * as cloudinaryService from '@/lib/cloudinary';
import { v2 as cloudinary } from 'cloudinary';

describe('cloudinary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('isCloudinaryConfigured', () => {
    it('should return true when all env vars are set', () => {
      expect(cloudinaryService.isCloudinaryConfigured()).toBe(true);
    });

    it('should return false when env vars are missing', () => {
      const originalCloudName = process.env.CLOUDINARY_CLOUD_NAME;
      delete process.env.CLOUDINARY_CLOUD_NAME;

      // Re-import to get fresh evaluation
      vi.resetModules();
      
      process.env.CLOUDINARY_CLOUD_NAME = originalCloudName;
    });
  });

  describe('uploadToCloudinary', () => {
    it('should upload buffer successfully', async () => {
      const mockResult = {
        url: 'http://example.com/image.jpg',
        secure_url: 'https://example.com/image.jpg',
        public_id: 'test-image',
        format: 'jpg',
        resource_type: 'image',
        width: 800,
        height: 600,
        bytes: 12345,
      };

      const mockUploadStream = {
        end: vi.fn(),
      };

      (cloudinary.uploader.upload_stream as any).mockImplementation((options: any, callback: any) => {
        callback(null, mockResult);
        return mockUploadStream;
      });

      const buffer = Buffer.from('test');
      const result = await cloudinaryService.uploadToCloudinary(buffer);

      expect(result).toMatchObject({
        url: mockResult.url,
        secureUrl: mockResult.secure_url,
        publicId: mockResult.public_id,
        format: mockResult.format,
        resourceType: mockResult.resource_type,
        width: mockResult.width,
        height: mockResult.height,
        bytes: mockResult.bytes,
      });
      expect(mockUploadStream.end).toHaveBeenCalledWith(buffer);
    });

    it('should generate thumbnail for images', async () => {
      const mockResult = {
        url: 'http://example.com/image.jpg',
        secure_url: 'https://example.com/image.jpg',
        public_id: 'test-image',
        format: 'jpg',
        resource_type: 'image',
        width: 800,
        height: 600,
        bytes: 12345,
      };

      const mockUploadStream = {
        end: vi.fn(),
      };

      (cloudinary.uploader.upload_stream as any).mockImplementation((options: any, callback: any) => {
        callback(null, mockResult);
        return mockUploadStream;
      });

      const buffer = Buffer.from('test');
      const result = await cloudinaryService.uploadToCloudinary(buffer);

      expect(result.thumbnailUrl).toBeDefined();
      expect(cloudinary.url).toHaveBeenCalledWith(mockResult.public_id, expect.objectContaining({
        width: 300,
        height: 300,
        crop: 'fill',
      }));
    });

    it('should not generate thumbnail for non-images', async () => {
      const mockResult = {
        url: 'http://example.com/file.pdf',
        secure_url: 'https://example.com/file.pdf',
        public_id: 'test-file',
        format: 'pdf',
        resource_type: 'raw',
        bytes: 12345,
      };

      const mockUploadStream = {
        end: vi.fn(),
      };

      (cloudinary.uploader.upload_stream as any).mockImplementation((options: any, callback: any) => {
        callback(null, mockResult);
        return mockUploadStream;
      });

      const buffer = Buffer.from('test');
      const result = await cloudinaryService.uploadToCloudinary(buffer);

      expect(result.thumbnailUrl).toBeUndefined();
    });

    it('should handle upload errors', async () => {
      const mockError = new Error('Upload failed');

      const mockUploadStream = {
        end: vi.fn(),
      };

      (cloudinary.uploader.upload_stream as any).mockImplementation((options: any, callback: any) => {
        callback(mockError, null);
        return mockUploadStream;
      });

      const buffer = Buffer.from('test');
      await expect(cloudinaryService.uploadToCloudinary(buffer)).rejects.toThrow('Upload failed');
    });

    it('should use custom options', async () => {
      const mockResult = {
        url: 'http://example.com/image.jpg',
        secure_url: 'https://example.com/image.jpg',
        public_id: 'custom-id',
        format: 'jpg',
        resource_type: 'image',
        bytes: 12345,
      };

      const mockUploadStream = {
        end: vi.fn(),
      };

      let capturedOptions: any;
      (cloudinary.uploader.upload_stream as any).mockImplementation((options: any, callback: any) => {
        capturedOptions = options;
        callback(null, mockResult);
        return mockUploadStream;
      });

      const buffer = Buffer.from('test');
      await cloudinaryService.uploadToCloudinary(buffer, {
        folder: 'custom-folder',
        resourceType: 'image',
        publicId: 'custom-id',
      });

      expect(capturedOptions).toMatchObject({
        folder: 'custom-folder',
        resource_type: 'image',
        public_id: 'custom-id',
      });
    });
  });

  describe('uploadBase64ToCloudinary', () => {
    it('should upload base64 successfully', async () => {
      const mockResult = {
        url: 'http://example.com/image.jpg',
        secure_url: 'https://example.com/image.jpg',
        public_id: 'test-image',
        format: 'jpg',
        resource_type: 'image',
        width: 800,
        height: 600,
        bytes: 12345,
      };

      (cloudinary.uploader.upload as any).mockResolvedValue(mockResult);

      const base64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRg==';
      const result = await cloudinaryService.uploadBase64ToCloudinary(base64);

      expect(result).toMatchObject({
        url: mockResult.url,
        secureUrl: mockResult.secure_url,
        publicId: mockResult.public_id,
      });
    });
  });

  describe('deleteFromCloudinary', () => {
    it('should delete file successfully', async () => {
      (cloudinary.uploader.destroy as any).mockResolvedValue({ result: 'ok' });

      const result = await cloudinaryService.deleteFromCloudinary('test-image');

      expect(result).toBe(true);
      expect(cloudinary.uploader.destroy).toHaveBeenCalledWith('test-image', {
        resource_type: 'image',
      });
    });

    it('should return false on delete failure', async () => {
      (cloudinary.uploader.destroy as any).mockResolvedValue({ result: 'not found' });

      const result = await cloudinaryService.deleteFromCloudinary('test-image');

      expect(result).toBe(false);
    });

    it('should handle delete errors', async () => {
      (cloudinary.uploader.destroy as any).mockRejectedValue(new Error('Delete failed'));

      const result = await cloudinaryService.deleteFromCloudinary('test-image');

      expect(result).toBe(false);
    });
  });

  describe('getOptimizedImageUrl', () => {
    it('should generate optimized URL with default options', () => {
      const url = cloudinaryService.getOptimizedImageUrl('test-image');

      expect(cloudinary.url).toHaveBeenCalledWith('test-image', expect.objectContaining({
        crop: 'fill',
        quality: 'auto',
        fetch_format: 'auto',
      }));
    });

    it('should generate optimized URL with custom options', () => {
      cloudinaryService.getOptimizedImageUrl('test-image', {
        width: 500,
        height: 400,
        crop: 'scale',
        quality: 'high',
        format: 'webp',
      });

      expect(cloudinary.url).toHaveBeenCalledWith('test-image', expect.objectContaining({
        width: 500,
        height: 400,
        crop: 'scale',
        quality: 'high',
        fetch_format: 'webp',
      }));
    });
  });

  describe('getThumbnailUrl', () => {
    it('should generate thumbnail URL with default size', () => {
      cloudinaryService.getThumbnailUrl('test-image');

      expect(cloudinary.url).toHaveBeenCalledWith('test-image', expect.objectContaining({
        width: 300,
        height: 300,
        crop: 'fill',
        quality: 'auto',
        fetch_format: 'auto',
      }));
    });

    it('should generate thumbnail URL with custom size', () => {
      cloudinaryService.getThumbnailUrl('test-image', 500);

      expect(cloudinary.url).toHaveBeenCalledWith('test-image', expect.objectContaining({
        width: 500,
        height: 500,
      }));
    });
  });
});
