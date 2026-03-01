import { Outlet, Link } from 'react-router';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-4 md:px-8">
        <Link to="/" className="group">
          <h1 className="text-xl font-bold text-gray-900">NewsInsight</h1>
          <p className="text-xs text-gray-500">Your personalized news aggregator</p>
        </Link>
      </header>
      <Outlet />
    </div>
  );
}
