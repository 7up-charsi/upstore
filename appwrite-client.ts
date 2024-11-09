'use server';

import {
  Account,
  Avatars,
  Client,
  Databases,
  Storage,
} from 'node-appwrite';
import { appwriteConfig } from './appwrite.config';
import { cookies } from 'next/headers';

export const createSessionClient = async () => {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId);

  const session = (await cookies()).get('appwrite-session');

  if (!session || !session.value) throw new Error('No Session');

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
  };
};

export const createAdminClient = async () => {
  if (!process.env.APPWRITE_KEY)
    throw new Error('APPWRITE_KEY is not defined');

  const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId)
    .setKey(process.env.APPWRITE_KEY);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
    get storage() {
      return new Storage(client);
    },
    get avatars() {
      return new Avatars(client);
    },
  };
};
