import { useLocation } from 'react-router-dom';
import Avatar from '../ui/Avatar';
import Icon from '../ui/Icon';

const PAGE_TITLES = {
  '/': 'Inicio',
  '/recetas': 'Recetas',
  '/usuarios': 'Usuarios',
  '/estadisticas': 'Estadísticas',
};

export default function Navbar({ user, onToggleSidebar, onLogout }) {
  const { pathname } = useLocation();
  const currentPageTitle = PAGE_TITLES[pathname] ?? 'Página';
  const fullName = `${user.firstName} ${user.lastName}`.trim();

  return (
    <header className="navbar">
      <button type="button" className="icon-button navbar__menu" onClick={onToggleSidebar} aria-label="Abrir o cerrar menú">
        <Icon name="menu" size={22} />
      </button>

      <nav className="navbar__breadcrumb" aria-label="Ruta">
        <span>Panel</span>
        <span aria-hidden="true">/</span>
        <strong>{currentPageTitle}</strong>
      </nav>

      <div className="navbar__spacer" />

      <div className="navbar__user">
        <Avatar src={user.image} name={fullName} size={44} />
        <div className="navbar__user-text">
          <span className="navbar__user-name">{fullName}</span>
          <span className="navbar__user-role">@{user.username}</span>
        </div>
      </div>

      <span className="navbar__divider" aria-hidden="true" />

      <button type="button" className="btn btn--outline btn--sm navbar__logout" onClick={onLogout}>
        <Icon name="logout" size={16} />
        <span>Cerrar sesión</span>
      </button>
    </header>
  );
}
