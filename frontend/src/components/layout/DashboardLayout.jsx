import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const DashboardLayout = () => {
  return (
    <div className="min-vh-100 bg-light">
      <div className="container-fluid py-3">
        <div className="row g-3">
          <div className="col-lg-3 col-xl-2">
            <Sidebar />
          </div>

          <div className="col-lg-9 col-xl-10">
            <Navbar />

            <main className="bg-white rounded-3 shadow-sm p-4 min-vh-75">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
