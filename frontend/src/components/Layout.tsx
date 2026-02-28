import { Outlet, Link } from 'react-router';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3 md:px-8">
        <Link to="/" className="text-xl font-bold text-gray-900">
          NewsInsight
        </Link>
      </header>
      <Outlet />
    </div>
  );
}
