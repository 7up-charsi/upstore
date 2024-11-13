import { RenameActionDialog } from './_components/rename-action-dialog';
import { DeleteActionDialog } from './_components/delete-action-dialog';
import { ShareActionDialog } from './_components/share-action-dialog';
import { getFiles } from '@/actions/files.actions';
import { Card } from './_components/card';

interface FilesPageProps {
  params: Promise<{ type: string }>;
}

export default async function FilesPage(props: FilesPageProps) {
  const { type } = await props.params;

  const data = await getFiles();

  if (!data.success) {
    <p>Something went wrong on server!. Please try again latter</p>;

    return;
  }

  const totalSize = 0;

  return (
    <main className="p-5 md:p-8">
      <h1 className="text-3xl font-bold capitalize">{type}</h1>

      <div className="mt-5 flex items-center gap-3">
        <span
          aria-label={`total size of below documents is ${totalSize}mb`}
          className="text-sm"
        >
          Total: <span className="font-medium">{totalSize} MB</span>
        </span>

        <div className="grow"></div>

        {/* TODO: SortBy */}
        <div className=""></div>
      </div>

      {data.files.total > 0 ? (
        <section className="mt-5 grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {data.files.documents.map((file) => (
            <Card key={file.$id} {...file} />
          ))}
        </section>
      ) : (
        <p className="my-10 text-center text-2xl font-medium text-foreground/50">
          No files uploaded
        </p>
      )}

      <RenameActionDialog />
      <ShareActionDialog />
      <DeleteActionDialog />
    </main>
  );
}
