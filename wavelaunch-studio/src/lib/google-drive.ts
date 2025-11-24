/**
 * Google Drive Storage Service
 * 
 * Free alternative to Cloudinary using Google Drive API
 * Provides 15GB free storage per Google account
 */

import { google } from 'googleapis';

// Initialize Google Drive API
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_DRIVE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_DRIVE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});

const drive = google.drive({ version: 'v3', auth });

// Folder ID where all files will be stored
const WAVELAUNCH_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || 'root';

interface UploadOptions {
  folder?: string;
  mimeType?: string;
  makePublic?: boolean;
}

interface UploadResult {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  webViewLink: string;
  webContentLink?: string;
  thumbnailLink?: string;
  downloadUrl: string;
}

/**
 * Upload file to Google Drive
 */
export async function uploadToGoogleDrive(
  buffer: Buffer,
  fileName: string,
  options: UploadOptions = {}
): Promise<UploadResult> {
  try {
    let parentFolderId = WAVELAUNCH_FOLDER_ID;
    
    if (options.folder) {
      parentFolderId = await getOrCreateFolder(options.folder, WAVELAUNCH_FOLDER_ID);
    }

    const fileMetadata: any = {
      name: fileName,
      parents: [parentFolderId],
    };

    const mimeType = options.mimeType || getMimeType(fileName);

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: {
        mimeType,
        body: buffer,
      },
      fields: 'id, name, mimeType, size, webViewLink, webContentLink, thumbnailLink',
    });

    const file = response.data;

    if (options.makePublic) {
      await drive.permissions.create({
        fileId: file.id!,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });
    }

    const downloadUrl = `https://drive.google.com/uc?export=download&id=${file.id}`;

    return {
      id: file.id!,
      name: file.name!,
      mimeType: file.mimeType!,
      size: parseInt(file.size || '0'),
      webViewLink: file.webViewLink!,
      webContentLink: file.webContentLink,
      thumbnailLink: file.thumbnailLink,
      downloadUrl,
    };
  } catch (error) {
    console.error('Google Drive upload error:', error);
    throw new Error('Failed to upload file to Google Drive');
  }
}

/**
 * Delete file from Google Drive
 */
export async function deleteFromGoogleDrive(fileId: string): Promise<boolean> {
  try {
    await drive.files.delete({ fileId });
    return true;
  } catch (error) {
    console.error('Google Drive delete error:', error);
    return false;
  }
}

/**
 * Get or create folder
 */
async function getOrCreateFolder(
  folderName: string,
  parentFolderId: string
): Promise<string> {
  try {
    const response = await drive.files.list({
      q: `name='${folderName}' and '${parentFolderId}' in parents and mimeType='application/vnd.google-apps.folder'`,
      fields: 'files(id)',
    });

    if (response.data.files && response.data.files.length > 0) {
      return response.data.files[0].id!;
    }

    const folderResponse = await drive.files.create({
      requestBody: {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [parentFolderId],
      },
      fields: 'id',
    });

    return folderResponse.data.id!;
  } catch (error) {
    console.error('Google Drive create folder error:', error);
    throw error;
  }
}

/**
 * Get MIME type from file extension
 */
function getMimeType(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    zip: 'application/zip',
    txt: 'text/plain',
  };

  return mimeTypes[ext || ''] || 'application/octet-stream';
}

/**
 * Check if Google Drive is configured
 */
export function isGoogleDriveConfigured(): boolean {
  return !!(
    process.env.GOOGLE_DRIVE_CLIENT_EMAIL &&
    process.env.GOOGLE_DRIVE_PRIVATE_KEY &&
    process.env.GOOGLE_DRIVE_FOLDER_ID
  );
}
