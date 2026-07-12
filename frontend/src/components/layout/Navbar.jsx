import { NavLink } from 'react-router-dom';
import { navigationItems } from '../../constants/navigation';

const Navbar = () => {
  return (
    <header className="navbar navbar-expand-lg navbar-light bg-white rounded-3 shadow-sm px-3 py-2 mb-3">
      <div className="container-fluid">
        <span className="navbar-brand fw-semibold">Operations Center</span>

        <nav className="navbar-nav flex-row flex-wrap gap-2 ms-auto">
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `nav-link px-2 py-1 rounded ${isActive ? 'active text-primary' : 'text-muted'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
