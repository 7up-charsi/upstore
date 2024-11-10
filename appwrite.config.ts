if (!process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  throw new Error('NEXT_PUBLIC_APPWRITE_ENDPOINT is not defined');

if (!process.env.NEXT_PUBLIC_APPWRITE_PROJECT)
  throw new Error('NEXT_PUBLIC_APPWRITE_PROJECT is not defined');

if (!process.env.NEXT_PUBLIC_APPWRITE_DATABASE)
  throw new Error('NEXT_PUBLIC_APPWRITE_DATABASE is not defined');

if (!process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION)
  throw new Error(
    'NEXT_PUBLIC_APPWRITE_FILES_COLLECTION is not defined',
  );

if (!process.env.NEXT_PUBLIC_APPWRITE_BUCKET)
  throw new Error('NEXT_PUBLIC_APPWRITE_BUCKET is not defined');

// DO NOT ADD SECRET KEYS

export const appwriteConfig = {
  endpointUrl: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
  filesCollectionId:
    process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION,
  bucketId: process.env.NEXT_PUBLIC_APPWRITE_BUCKET,
};
