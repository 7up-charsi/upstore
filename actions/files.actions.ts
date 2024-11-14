'use server';

import {
  auth,
  clerkClient,
  currentUser,
  User,
} from '@clerk/nextjs/server';
import { createAdminClient } from '@/appwrite-client';
import { appwriteConfig } from '@/appwrite.config';
import { Query } from 'node-appwrite';
import { MinimalUser } from '@/types';

const createQuries = (userId: string, userEmail: string) => {
  const queries = [
    Query.or([
      Query.equal('userId', [userId]),
      Query.contains('users', [userEmail]),
    ]),
  ];

  return queries;
};

export const getFiles = async () => {
  const { databases } = await createAdminClient();

  const clerk = await clerkClient();

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

    const files = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      queries,
    );

    const withUser = files.documents.map(async (file) => {
      const user = await clerk.users.getUser(file.userId);

      let users: User[] = [];

      if (file.users.length) {
        const usersList = await clerk.users.getUserList({
          emailAddress: file.users,
        });

        users = usersList.data;
      }

      const minimalUser: MinimalUser = {
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.primaryEmailAddress?.emailAddress || '',
        id: user.id,
      };

      return {
        ...file,
        user: minimalUser,
        users: users.map(
          (user): MinimalUser => ({
            fullName: `${user.firstName} ${user.lastName}`,
            email: user.primaryEmailAddress?.emailAddress || '',
            id: user.id,
          }),
        ),
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

interface RenameFileProps {
  id: string;
  name: string;
}

export const renameFile = async (props: RenameFileProps) => {
  const { id, name } = props;

  const { databases } = await createAdminClient();

  try {
    const { userId } = await auth();

    if (!userId)
      return {
        success: false,
        message: 'Unauthorized request',
      };

    const file = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      id,
    );

    if (!file) {
      return {
        success: false,
        message: 'File does not exist',
      };
    }

    if (file.userId !== userId) {
      return {
        success: false,
        message: 'Your are not owner of this file.',
      };
    }

    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      id,
      { name: `${name}.${file.extension}` },
    );

    return {
      success: true,
      message: 'File renamed successfully',
      updatedFile,
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: 'Failed to rename file' };
  }
};

interface UpdateFileUsersProps {
  id: string;
  emails: string[];
}

export const updateFileUsers = async (
  props: UpdateFileUsersProps,
) => {
  const { emails, id } = props;

  const { databases } = await createAdminClient();

  try {
    const { userId } = await auth();

    if (!userId)
      return {
        success: false,
        message: 'Unauthorized request',
      };

    const usersList = await (
      await clerkClient()
    ).users.getUserList({
      emailAddress: emails,
    });

    const realUsers = usersList.data;

    if (realUsers.find((user) => user.id === userId)) {
      return {
        success: false,
        message: 'You can not invite yourself.',
      };
    }

    if (emails.length !== realUsers.length) {
      return { success: false, message: 'Please provide real users' };
    }

    const file = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      id,
    );

    if (!file) {
      return {
        success: false,
        message: 'File does not exist',
      };
    }

    if (file.userId !== userId) {
      return {
        success: false,
        message: 'Your are not owner of this file.',
      };
    }

    const userExists = file.users.find((ele: string) =>
      emails.includes(ele),
    );

    if (userExists) {
      return {
        success: false,
        message: `${userExists} already have access.`,
      };
    }

    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      id,
      { users: emails },
    );

    return {
      success: true,
      message: 'File users updated successfully',
      updatedFile,
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: 'Failed to update file users' };
  }
};

interface RemoveFileSharedUserProps {
  id: string;
  email: string;
}

export const removeFileSharedUser = async (
  props: RemoveFileSharedUserProps,
) => {
  const { email, id } = props;

  const { databases } = await createAdminClient();

  try {
    const { userId } = await auth();

    if (!userId)
      return {
        success: false,
        message: 'Unauthorized request',
      };

    const file = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      id,
    );

    if (!file) {
      return {
        success: false,
        message: 'File does not exist',
      };
    }

    if (file.userId !== userId) {
      return {
        success: false,
        message: 'Your are not owner of this file.',
      };
    }

    if (!file.users.includes(email)) {
      return {
        success: false,
        message: `${email} user never invited.`,
      };
    }

    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      id,
      { users: file.users.filter((user: string) => user !== email) },
    );

    return {
      success: true,
      message: 'Shared user removed successfully',
      updatedFile,
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: 'Failed to remove file user' };
  }
};

interface DeleteFileUsersProps {
  id: string;
  bucketFileId: string;
}

export const deleteFile = async (props: DeleteFileUsersProps) => {
  const { id, bucketFileId } = props;

  const { databases, storage } = await createAdminClient();

  try {
    const { userId } = await auth();

    if (!userId)
      return {
        success: false,
        message: 'Unauthorized request',
      };

    const file = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      id,
    );

    if (!file) {
      return {
        success: false,
        message: 'File does not exist',
      };
    }

    if (file.userId !== userId) {
      return {
        success: false,
        message: 'Your are not owner of this file.',
      };
    }

    const deletedFile = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      id,
    );

    if (deletedFile) {
      await storage.deleteFile(appwriteConfig.bucketId, bucketFileId);
    }

    return {
      success: true,
      message: 'File deleted successfully',
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: 'Failed to delete file' };
  }
};
