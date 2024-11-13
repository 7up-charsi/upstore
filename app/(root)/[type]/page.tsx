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
        <section className="mt-5 grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6">
          {data.files.documents.map((file) => (
            <Card key={file.$id} {...file} />
          ))}
        </section>
      ) : (
        <p className="my-10 text-center text-2xl font-medium text-foreground/50">
          No files uploaded
        </p>
      )}
    </main>
  );
}
