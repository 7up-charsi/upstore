import { createAdminClient } from '@/appwrite-client';
import { appwriteConfig } from '@/appwrite.config';
import { InputFile } from 'node-appwrite/file';
import { auth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import { getFileType } from '@/lib/utils';
import { ID } from 'node-appwrite';

export const POST = async (req: NextRequest) => {
  const formData = await req.formData();

  const file = formData.get('file') as File;

  const { userId } = await auth();

  const { storage, databases } = await createAdminClient();

  try {
    const inputFile = InputFile.fromBuffer(file, file.name);

    const bucketFile = await storage.createFile(
      appwriteConfig.bucketId,
      ID.unique(),
      inputFile,
    );

    const { extension, type } = getFileType(file);

    const fileDocument = {
      type,
      extension,
      userId,
      name: bucketFile.name,
      size: bucketFile.sizeOriginal,
      bucketFileId: bucketFile.$id,
      users: [],
    };

    const newFile = await databases
      .createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.filesCollectionId,
        ID.unique(),
        fileDocument,
      )
      .catch(async () => {
        await storage.deleteFile(
          appwriteConfig.bucketId,
          bucketFile.$id,
        );

        throw new Error('Failed to create file document');
      });

    return Response.json({
      success: true,
      message: 'File uploaded',
      newFile,
    });
  } catch (error) {
    console.log({ serverErrr: error });

    return Response.json({
      success: false,
      message: 'File upload failed',
    });
  }
};
