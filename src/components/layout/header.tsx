import { Bell, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function Header() {
  return (
    <header className="h-16 border-b border-purple-100 bg-white px-4 flex items-center justify-between">
      <div className="flex items-center flex-1">
        <div className="max-w-lg w-full lg:max-w-xs">
          <label htmlFor="search" className="sr-only">
            Search
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <Input
              id="search"
              className="pl-10"
              placeholder="Search suppliers, events..."
              type="search"
            />
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <button className="rounded-full p-1 text-gray-400 hover:text-gray-500">
          <span className="sr-only">View notifications</span>
          <Bell className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}