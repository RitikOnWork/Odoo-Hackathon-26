import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import Login from '../pages/Login';
import DashboardPage from '../pages/DashboardPage';
import VehiclesPage from '../pages/VehiclesPage';
import DriversPage from '../pages/DriversPage';
import TripsPage from '../pages/TripsPage';
import MaintenancePage from '../pages/MaintenancePage';
import FuelLogsPage from '../pages/FuelLogsPage';
import ExpensesPage from '../pages/ExpensesPage';
import ReportsPage from '../pages/ReportsPage';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/vehicles" element={<VehiclesPage />} />
          <Route path="/drivers" element={<DriversPage />} />
          <Route path="/trips" element={<TripsPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="/fuel-logs" element={<FuelLogsPage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/reports" element={<ReportsPage />} />
        </Route>

        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
