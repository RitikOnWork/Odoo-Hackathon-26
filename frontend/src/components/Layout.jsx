import { Outlet } from 'react-router-dom';
import Sidebar from './layout/Sidebar';
import Navbar from './layout/Navbar';
import AIButton from './common/AIButton';

const Layout = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex min-h-screen flex-1 flex-col">
          <Navbar />

          <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
            <Outlet />
            <AIButton />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
