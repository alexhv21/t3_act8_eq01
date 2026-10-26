import { NavLink } from 'react-router-dom';
import { useRecipes } from '../../hooks/useRecipes';
import Icon from '../ui/Icon';
import Logo from '../ui/Logo';

const NAVIGATION_SECTIONS = [
  {
    title: 'Principal',
    items: [
      { to: '/', label: 'Inicio', icon: 'home', end: true },
      { to: '/recetas', label: 'Recetas', icon: 'book', showRecipeCount: true },
      { to: '/usuarios', label: 'Usuarios', icon: 'users' },
    ],
  },
  {
    title: 'Contenido',
    items: [{ to: '/estadisticas', label: 'Estadísticas', icon: 'chart' }],
  },
];

export default function Sidebar({ isOpen, onNavigate, onLogout }) {
  const { recipes, status } = useRecipes();

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`} aria-label="Menú principal">
      <div className="sidebar__brand">
        <Logo variant="dark" />
      </div>

      <nav className="sidebar__nav">
        {NAVIGATION_SECTIONS.map((section) => (
          <div key={section.title} className="sidebar__section">
            <p className="sidebar__section-title">{section.title}</p>
            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onNavigate}
                className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
              >
                <Icon name={item.icon} size={20} />
                <span>{item.label}</span>
                {item.showRecipeCount && status === 'success' && (
                  <span className="sidebar__badge">{recipes.length}</span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar__footer">
        <div className="sidebar__help">
          <p className="sidebar__help-title">¿Necesitas ayuda?</p>
          <p className="sidebar__help-text">Consulta la guía del panel</p>
        </div>
        <button type="button" className="sidebar__link sidebar__link--button" onClick={onLogout}>
          <Icon name="logout" size={20} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
