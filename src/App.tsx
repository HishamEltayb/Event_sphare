import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/auth/login';
import { DashboardLayout } from './components/layout/dashboard-layout';
import { SupplierLayout } from './components/layout/supplier-layout';
import DashboardHome from './pages/dashboard/home';
import SuppliersPage from './pages/dashboard/suppliers';
import EventsPage from './pages/dashboard/events';
import SettingsPage from './pages/dashboard/settings';
import SupplierDetailsPage from './pages/dashboard/supplier-details/supplier-details';
import SupplierLoginPage from './pages/dashboard/supplier-details/supplier-login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        
        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="suppliers" element={<SuppliersPage />} />
          <Route path="suppliers/:supplierId" element={<SupplierDetailsPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Supplier Routes */}
        <Route path="/supplier" element={<SupplierLayout />}>
          <Route path="login" element={<SupplierLoginPage />} />
          <Route path="profile" element={<SupplierDetailsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;