import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import Logo from './Logo.jsx';

const navItems = [
  { label: 'Dashboard', to: '/' },
  { label: 'Employees', to: '/employees' },
  { label: 'Departments', to: '/departments' },
  { label: 'Positions', to: '/positions' },
  { label: 'Roles & Permissions', to: '/roles' }
];

function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar__header">
          <Logo />
        </div>
        <nav className="sidebar__nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="main">
        <header className="topbar">
          <div className="topbar__title">
            <h1>Mobinhost ERP</h1>
            <p className="topbar__subtitle">Empower your workforce with clarity</p>
          </div>
          <div className="topbar__actions">
            <div className="topbar__user">
              <span className="topbar__user-name">{user?.username}</span>
              <span className="topbar__user-email">{user?.email}</span>
            </div>
            <button type="button" className="btn btn--ghost" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
