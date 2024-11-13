import { auth, currentUser } from '@clerk/nextjs/server';
import { createAdminClient } from '@/appwrite-client';
import { appwriteConfig } from '@/appwrite.config';
import { Models, Query } from 'node-appwrite';
import { DbFile } from '@/types';

const createQuries = (userId: string, userEmail: string) => {
  const queries = [
    Query.or([
      Query.equal('userId', [userId]),
      Query.contains('users', [userEmail]),
    ]),
  ];

  return queries;
};

type GetFilesReturn =
  | {
      success: true;
      message: string;
      files: Models.DocumentList<Models.Document & DbFile>;
    }
  | { success: false; message: string };

export const getFiles = async (): Promise<GetFilesReturn> => {
  const { databases } = await createAdminClient();

  try {
    const { userId } = await auth();

    const user = await currentUser();

    if (!userId || !user)
      return {
        success: false,
        message: 'Unauthorized request',
      };

    const queries = createQuries(
      userId,
      user.primaryEmailAddress?.emailAddress || '',
    );

    const files = (await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      queries,
    )) as Models.DocumentList<Models.Document & DbFile>;

    return {
      success: true,
      message: 'Files retrieved successfully',
      files,
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: 'Failed to get files' };
  }
};
