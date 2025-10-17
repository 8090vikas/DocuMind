import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-blue-600">DocuMind</span>
            </Link>
          </div>
          <div className="flex items-center">
            {/* Add navigation items here */}
          </div>
        </div>
      </div>
    </nav>
  );
}