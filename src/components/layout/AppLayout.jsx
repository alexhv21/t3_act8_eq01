import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { RecipesProvider } from '../../context/RecipesContext';
import { useAuth } from '../../hooks/useAuth';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

/** Estructura del sistema: sidebar a la izquierda, navbar arriba y la página en el centro. */
export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <RecipesProvider>
      <div className="app-shell">
        <Sidebar
          isOpen={isSidebarOpen}
          onNavigate={() => setIsSidebarOpen(false)}
          onLogout={handleLogout}
        />
        {isSidebarOpen && (
          <div className="sidebar-backdrop" onClick={() => setIsSidebarOpen(false)} aria-hidden="true" />
        )}

        <div className="app-shell__main">
          <Navbar
            user={user}
            onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
            onLogout={handleLogout}
          />
          <main className="app-shell__content">
            <Outlet />
          </main>
        </div>
      </div>
    </RecipesProvider>
  );
}
