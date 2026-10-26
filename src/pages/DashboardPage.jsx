import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import RecipesTable from '../components/table/RecipesTable';
import Icon from '../components/ui/Icon';
import { ErrorMessage, Loader } from '../components/ui/StatusMessages';
import { useAuth } from '../hooks/useAuth';
import { useRecipes } from '../hooks/useRecipes';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

const todayLabel = new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());

export default function DashboardPage() {
  const { user } = useAuth();
  const { recipes, status, errorMessage, reloadRecipes } = useRecipes();

  const stats = useMemo(() => {
    const rated = recipes.filter((recipe) => recipe.rating > 0);
    const averageRating = rated.length
      ? rated.reduce((sum, recipe) => sum + recipe.rating, 0) / rated.length
      : 0;
    return [
      { label: 'Recetas registradas', value: recipes.length, icon: 'book', tone: 'barro', note: 'Desde DummyJSON' },
      { label: 'Tipos de cocina', value: new Set(recipes.map((recipe) => recipe.cuisine)).size, icon: 'globe', tone: 'agave', note: 'Cocinas distintas' },
      { label: 'Calificación promedio', value: averageRating.toFixed(1), icon: 'star', tone: 'cempa', note: `${rated.length} recetas calificadas` },
      { label: 'Recetas fáciles', value: recipes.filter((recipe) => recipe.difficulty === 'Easy').length, icon: 'check', tone: 'morado', note: 'Ideales para empezar' },
    ];
  }, [recipes]);

  const latestRecipes = useMemo(
    () => [...recipes].sort((a, b) => b.id - a.id).slice(0, 5),
    [recipes],
  );

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1 className="page__title">¡{getGreeting()}, {user.firstName}!</h1>
          <p className="page__subtitle">Esto es lo que pasa hoy en Sabores de Oaxaca.</p>
        </div>
        <div className="page__actions">
          <span className="date-pill">
            <Icon name="calendar" size={16} /> {todayLabel}
          </span>
          <Link to="/recetas" className="btn btn--primary">
            <Icon name="book" size={18} /> Gestionar recetas
          </Link>
        </div>
      </div>

      {status === 'loading' && <Loader message="Cargando información…" />}
      {status === 'error' && (
        <div className="card">
          <ErrorMessage title="No pudimos cargar las recetas" message={errorMessage} onRetry={reloadRecipes} />
        </div>
      )}

      {status === 'success' && (
        <>
          <section className="stats-grid" aria-label="Resumen">
            {stats.map((stat) => (
              <article key={stat.label} className="stat-card">
                <div className="stat-card__top">
                  <span className="stat-card__label">{stat.label}</span>
                  <span className={`stat-card__icon stat-card__icon--${stat.tone}`}>
                    <Icon name={stat.icon} size={18} />
                  </span>
                </div>
                <p className="stat-card__value">{stat.value}</p>
                <p className="stat-card__note">{stat.note}</p>
              </article>
            ))}
          </section>

          <section className="card">
            <div className="card__header">
              <div>
                <h2 className="card__title">Recetas recientes</h2>
                <p className="card__subtitle">Las últimas recetas agregadas al recetario</p>
              </div>
              <Link to="/recetas" className="link link--icon">
                Ver todas las recetas <Icon name="arrow" size={16} />
              </Link>
            </div>
            <RecipesTable recipes={latestRecipes} />
          </section>
        </>
      )}
    </div>
  );
}
