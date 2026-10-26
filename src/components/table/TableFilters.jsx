import Icon from '../ui/Icon';
import { DIFFICULTY_OPTIONS, getCuisineLabel, getDifficultyLabel } from '../../utils/recipes';

/** Filtros de la tabla: búsqueda por nombre, tipo de cocina y dificultad. */
export default function TableFilters({
  search,
  cuisine,
  difficulty,
  cuisineOptions,
  hasActiveFilters,
  onSearchChange,
  onCuisineChange,
  onDifficultyChange,
  onClearFilters,
}) {
  return (
    <div className="table-filters">
      <label className="search-field">
        <Icon name="search" size={18} className="text-muted" />
        <span className="sr-only">Buscar receta por nombre</span>
        <input
          type="search"
          placeholder="Buscar por nombre de receta…"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </label>

      <label className={`select-field ${cuisine ? 'select-field--active' : ''}`}>
        <Icon name="globe" size={16} />
        <span className="sr-only">Filtrar por tipo de cocina</span>
        <select value={cuisine} onChange={(event) => onCuisineChange(event.target.value)}>
          <option value="">Todas las cocinas</option>
          {cuisineOptions.map((option) => (
            <option key={option} value={option}>
              {getCuisineLabel(option)}
            </option>
          ))}
        </select>
      </label>

      <label className={`select-field ${difficulty ? 'select-field--active' : ''}`}>
        <Icon name="filter" size={16} />
        <span className="sr-only">Filtrar por dificultad</span>
        <select value={difficulty} onChange={(event) => onDifficultyChange(event.target.value)}>
          <option value="">Cualquier dificultad</option>
          {DIFFICULTY_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {getDifficultyLabel(option)}
            </option>
          ))}
        </select>
      </label>

      <button type="button" className="link-button" onClick={onClearFilters} disabled={!hasActiveFilters}>
        <Icon name="refresh" size={16} />
        Limpiar filtros
      </button>
    </div>
  );
}
