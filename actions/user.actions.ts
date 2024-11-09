'use server';

import { createAdminClient } from '@/appwrite-client';
import { appwriteConfig } from '@/appwrite.config';
import { signUpSchema } from '@/zod/auth-schema';
import { ID, Query } from 'node-appwrite';
import { z } from 'zod';

const getUserByEmail = async (email: string) => {
  const { databases } = await createAdminClient();

  const result = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    [Query.equal('email', [email])],
  );

  return result.total > 0 ? result.documents[0] : null;
};

const sendEmailOTP = async (email: string) => {
  const { account } = await createAdminClient();

  try {
    const session = await account.createEmailToken(
      ID.unique(),
      email,
    );

    return session.userId;
  } catch (error) {
    console.log(error);
  }
};

type CreateUserProps = z.input<typeof signUpSchema>;

export const createUser = async (props: CreateUserProps) => {
  const { email, fullName } = props;

  const existingUser = await getUserByEmail(email);

  const accountId = await sendEmailOTP(email);

  if (!accountId) throw new Error('Failed to send OTP');

  if (!existingUser) {
    const { databases } = await createAdminClient();

    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      ID.unique(),
      {
        fullName,
        email,
        accountId,
        avatar:
          'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
      },
    );
  }

  return { accountId };
};
