export interface DbFile {
  name: string;
  type: 'document' | 'image' | 'video' | 'audio' | 'other';
  bucketFileId: string;
  userId: string;
  size: number;
  url: string;
  users: string[];
  extension: string;
}
