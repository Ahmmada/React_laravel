import { Link } from '@inertiajs/react';

export default function NameCellRenderer({ data }: { data: any }) {
  if (!data) return null;

  return (
    <Link
      href={route('people.show', data.id)}
      className="text-blue-600 hover:underline"
      onClick={(e) => e.stopPropagation()}
    >
      {data.name}
    </Link>
  );
}