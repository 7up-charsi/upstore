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

    const withUser = files.documents.map(async (file) => {
      const res = await fetch(
        `https://api.clerk.com/v1/users/${file.userId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
          },
        },
      );

      const user = await res.json();

      let users = [];

      if (file.users.length) {
        const searchParams = new URLSearchParams();

        file.users.forEach((ele) => {
          searchParams.append('email_address', ele);
        });

        const usersRes = await fetch(
          `https://api.clerk.com/v1/users?${searchParams.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
            },
          },
        );

        users = await usersRes.json();
      }

      return {
        ...file,
        user,
        users,
      };
    });

    const documents = await Promise.all(withUser);

    return {
      success: true,
      message: 'Files retrieved successfully',
      files: { ...files, documents },
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: 'Failed to get files' };
  }
};
