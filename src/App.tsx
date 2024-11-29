import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/auth/login';
import { DashboardLayout } from './components/layout/dashboard-layout';
import DashboardHome from './pages/dashboard/home';
import SuppliersPage from './pages/dashboard/suppliers';
import EventsPage from './pages/dashboard/events';
import SettingsPage from './pages/dashboard/settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="suppliers" element={<SuppliersPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;