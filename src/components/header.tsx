import { Bell, User } from 'lucide-react';
import { signOut } from '@/services/auth';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="h-16 border-b bg-white">
      <div className="h-full px-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Dashboard</h2>
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Bell className="h-5 w-5 text-gray-500" />
          </button>
          <button 
            onClick={handleSignOut}
            className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg"
          >
            <User className="h-5 w-5 text-gray-500" />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
} 