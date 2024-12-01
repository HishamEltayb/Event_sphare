import { Link } from 'react-router-dom';
import { Calendar, Users, Settings } from 'lucide-react';

export function Sidebar() {
  return (
    <div className="fixed left-0 top-0 w-64 h-full bg-white border-r shadow-sm">
      <div className="flex flex-col h-full">
        <div className="h-16 flex items-center px-6 border-b">
          <h1 className="text-xl font-semibold text-purple-600">EventSphere</h1>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/dashboard/events"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100"
              >
                <Calendar className="h-5 w-5 text-gray-500" />
                <span>Events</span>
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/suppliers"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100"
              >
                <Users className="h-5 w-5 text-gray-500" />
                <span>Suppliers</span>
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/settings"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100"
              >
                <Settings className="h-5 w-5 text-gray-500" />
                <span>Settings</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
} 