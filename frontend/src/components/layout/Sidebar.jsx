import { NavLink } from 'react-router-dom';
import { navigationItems } from '../../constants/navigation';

const Sidebar = () => {
  return (
    <aside className="bg-dark text-white rounded-3 p-3 h-100">
      <div className="mb-4">
        <h4 className="h5 mb-1">TransitOps</h4>
        <p className="small text-white-50 mb-0">Transport Operations Dashboard</p>
      </div>

      <nav className="nav flex-column gap-1">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `nav-link rounded-2 px-3 py-2 ${isActive ? 'bg-primary text-white' : 'text-white-50'}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
