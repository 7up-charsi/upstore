export interface MinimalUser {
  fullName: string;
  email: string;
  id: string;
}

export interface DbFile {
  name: string;
  type: 'document' | 'image' | 'video' | 'audio' | 'other';
  bucketFileId: string;
  userId: string;
  size: number;
  url: string;
  users: MinimalUser[];
  user: MinimalUser;
  extension: string;
}
