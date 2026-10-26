import { Link } from 'react-router-dom';
import Icon from '../components/ui/Icon';

/** Página simulada para opciones del menú que aún no tienen funcionalidad. */
export default function PlaceholderPage({ title, description, icon = 'tool' }) {
  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1 className="page__title">{title}</h1>
          <p className="page__subtitle">{description}</p>
        </div>
      </div>
      <section className="card">
        <div className="state-box">
          <span className="state-box__icon state-box__icon--muted">
            <Icon name={icon} size={26} />
          </span>
          <p className="state-box__title">Sección en construcción</p>
          <p className="state-box__text">Esta opción del menú es simulada para la actividad.</p>
          <Link to="/recetas" className="btn btn--outline">
            Ir a la tabla de recetas <Icon name="arrow" size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
