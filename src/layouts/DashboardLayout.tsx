import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/sidebar';
import { Header } from '../components/header';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="pl-64">
        <Header />
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
} 