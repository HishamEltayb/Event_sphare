import { Home, Users, Calendar, Settings, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Suppliers', href: '/dashboard/suppliers', icon: Users },
  { name: 'Events', href: '/dashboard/events', icon: Calendar },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="flex h-full w-64 flex-col bg-purple-900">
      <div className="flex h-16 items-center justify-center">
        <h1 className="text-xl font-bold text-white">EventSphere</h1>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                location.pathname === item.href
                  ? 'bg-purple-800 text-white'
                  : 'text-purple-100 hover:bg-purple-800',
                'group flex items-center rounded-md px-2 py-2 text-sm font-medium'
              )}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="flex-shrink-0 p-4">
        <button className="group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-purple-100 hover:bg-purple-800">
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
}