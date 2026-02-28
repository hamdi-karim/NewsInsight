import { useParams, Link } from 'react-router';

export default function ArticleDetailsPage() {
  const { source, id } = useParams<{ source: string; id: string }>();

  return (
    <main className="flex-1 p-4 md:p-8">
      <Link to="/" className="text-blue-600 hover:underline text-sm">
        &larr; Back to feed
      </Link>
      <h2 className="mt-4 text-2xl font-bold text-gray-900">Article Details</h2>
      <p className="mt-2 text-gray-500">
        Source: {source} | ID: {id}
      </p>
    </main>
  );
}
