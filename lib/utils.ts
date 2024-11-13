import { appwriteConfig } from '@/appwrite.config';
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

export const convertFileSize = (
  sizeInBytes: number,
  digits?: number,
) => {
  if (sizeInBytes < 1024) {
    return sizeInBytes + ' Bytes'; // Less than 1 KB, show in Bytes
  } else if (sizeInBytes < 1024 * 1024) {
    const sizeInKB = sizeInBytes / 1024;
    return sizeInKB.toFixed(digits || 1) + ' KB'; // Less than 1 MB, show in KB
  } else if (sizeInBytes < 1024 * 1024 * 1024) {
    const sizeInMB = sizeInBytes / (1024 * 1024);
    return sizeInMB.toFixed(digits || 1) + ' MB'; // Less than 1 GB, show in MB
  } else {
    const sizeInGB = sizeInBytes / (1024 * 1024 * 1024);
    return sizeInGB.toFixed(digits || 1) + ' GB'; // 1 GB or more, show in GB
  }
};

export const formatDateTime = (
  isoString: string | null | undefined,
) => {
  if (!isoString) return '—';

  const date = new Date(isoString);

  // Get hours and adjust for 12-hour format
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? 'pm' : 'am';

  // Convert hours to 12-hour format
  hours = hours % 12 || 12;

  // Format the time and date parts
  const time = `${hours}:${minutes.toString().padStart(2, '0')}${period}`;
  const day = date.getDate();
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const month = monthNames[date.getMonth()];

  return `${time}, ${day} ${month}`;
};

export const constructFileUrl = (bucketFileId: string) => {
  return `${appwriteConfig.endpointUrl}/storage/buckets/${appwriteConfig.bucketId}/files/${bucketFileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`;
};

export const constructDownloadUrl = (bucketFileId: string) => {
  return `${appwriteConfig.endpointUrl}/storage/buckets/${appwriteConfig.bucketId}/files/${bucketFileId}/download?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`;
};
