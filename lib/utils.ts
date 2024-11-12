import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getFileType = (file: File) => {
  const mimeType = file.type;
  const extension = file.name.split('.').pop()?.toLowerCase() || '';

  let fileType: string;

  // Derive the file type based on MIME type
  if (mimeType.startsWith('image/')) {
    fileType = 'image';
  } else if (mimeType.startsWith('video/')) {
    fileType = 'video';
  } else if (mimeType.startsWith('audio/')) {
    fileType = 'audio';
  } else if (
    mimeType.startsWith('application/') ||
    mimeType.startsWith('text/')
  ) {
    fileType = 'document';
  } else {
    fileType = 'other';
  }

  // Fallback check by extension if MIME type is unknown
  const documentExtensions = [
    'pdf',
    'doc',
    'docx',
    'txt',
    'xls',
    'xlsx',
    'csv',
    'rtf',
    'ods',
    'ppt',
    'odp',
    'md',
    'html',
    'htm',
    'epub',
    'pages',
    'fig',
    'psd',
    'ai',
    'indd',
    'xd',
    'sketch',
    'afdesign',
    'afphoto',
  ];
  const imageExtensions = [
    'jpg',
    'jpeg',
    'png',
    'gif',
    'bmp',
    'svg',
    'webp',
  ];
  const videoExtensions = ['mp4', 'avi', 'mov', 'mkv', 'webm'];
  const audioExtensions = ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a'];

  if (fileType === 'other') {
    if (documentExtensions.includes(extension)) fileType = 'document';
    else if (imageExtensions.includes(extension)) fileType = 'image';
    else if (videoExtensions.includes(extension)) fileType = 'video';
    else if (audioExtensions.includes(extension)) fileType = 'audio';
  }

  return { type: fileType, extension };
};
