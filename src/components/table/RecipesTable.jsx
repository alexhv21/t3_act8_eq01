import DifficultyBadge from '../recipes/DifficultyBadge';
import RecipeThumb from '../recipes/RecipeThumb';
import Icon from '../ui/Icon';
import { formatMinutes, getCuisineLabel, getMealTypeLabel, getTotalMinutes } from '../../utils/recipes';

/** Tabla de recetas. Si recibe onEdit/onDelete muestra la columna de acciones. */
export default function RecipesTable({ recipes, onEdit, onDelete }) {
  const showActions = Boolean(onEdit || onDelete);

  return (
    <div className="table-scroll">
      <table className="data-table">
        <thead>
          <tr>
            <th scope="col" className="col-id">ID</th>
            <th scope="col">Receta</th>
            <th scope="col">Cocina</th>
            <th scope="col">Dificultad</th>
            <th scope="col">Tiempo</th>
            <th scope="col">Calificación</th>
            <th scope="col" className="col-number">Porciones</th>
            {showActions && <th scope="col" className="col-actions">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {recipes.map((recipe) => (
            <tr key={recipe.id}>
              <td className="col-id">#{recipe.id}</td>
              <td>
                <div className="cell-recipe">
                  <RecipeThumb src={recipe.image} name={recipe.name} />
                  <div className="cell-recipe__text">
                    <span className="cell-recipe__name">
                      {recipe.name}
                      {recipe.isLocal && <span className="tag-new">Nueva</span>}
                    </span>
                    <span className="cell-recipe__meta">
                      {(recipe.mealType ?? []).map(getMealTypeLabel).join(', ') || '—'}
                    </span>
                  </div>
                </div>
              </td>
              <td>{getCuisineLabel(recipe.cuisine)}</td>
              <td>
                <DifficultyBadge difficulty={recipe.difficulty} />
              </td>
              <td className="cell-nowrap">
                <span className="cell-inline">
                  <Icon name="clock" size={14} className="text-muted" />
                  {formatMinutes(getTotalMinutes(recipe))}
                </span>
              </td>
              <td className="cell-nowrap">
                <span className="cell-inline">
                  <Icon name="star" size={15} className={recipe.rating ? 'text-star' : 'text-line'} />
                  <strong>{recipe.rating ? recipe.rating.toFixed(1) : '—'}</strong>
                  <span className="text-muted text-sm">({recipe.reviewCount ?? 0})</span>
                </span>
              </td>
              <td className="col-number">{recipe.servings}</td>
              {showActions && (
                <td className="col-actions">
                  <div className="row-actions">
                    {onEdit && (
                      <button
                        type="button"
                        className="icon-button icon-button--bordered"
                        onClick={() => onEdit(recipe)}
                        aria-label={`Editar ${recipe.name}`}
                        title="Editar"
                      >
                        <Icon name="edit" size={16} />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        type="button"
                        className="icon-button icon-button--bordered icon-button--danger"
                        onClick={() => onDelete(recipe)}
                        aria-label={`Eliminar ${recipe.name}`}
                        title="Eliminar"
                      >
                        <Icon name="trash" size={16} />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
