import Icon from '../ui/Icon';
import { PAGE_SIZE_OPTIONS, getPageNumbers } from '../../utils/pagination';

/** Controles de paginación: registros por página, resumen y números de página. */
export default function Pagination({ currentPage, totalPages, pageSize, totalItems, onPageChange, onPageSizeChange }) {
  const firstItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const lastItem = Math.min(currentPage * pageSize, totalItems);
  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  return (
    <div className="pagination">
      <label className="pagination__size">
        <span>Mostrar</span>
        <select value={pageSize} onChange={(event) => onPageSizeChange(Number(event.target.value))}>
          {PAGE_SIZE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span>registros por página</span>
      </label>

      <span className="pagination__divider" aria-hidden="true" />

      <p className="pagination__summary">
        Mostrando {firstItem} a {lastItem} de {totalItems} recetas
      </p>

      <nav className="pagination__pages" aria-label="Paginación">
        <button
          type="button"
          className="page-button page-button--wide"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={isFirstPage}
        >
          <Icon name="chevronLeft" size={16} />
          Anterior
        </button>

        {getPageNumbers(currentPage, totalPages).map((page) =>
          typeof page === 'string' ? (
            <span key={page} className="page-ellipsis" aria-hidden="true">
              …
            </span>
          ) : (
            <button
              key={page}
              type="button"
              className={`page-button ${page === currentPage ? 'page-button--active' : ''}`}
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? 'page' : undefined}
              aria-label={`Página ${page}`}
            >
              {page}
            </button>
          ),
        )}

        <button
          type="button"
          className="page-button page-button--wide"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={isLastPage}
        >
          Siguiente
          <Icon name="chevronRight" size={16} />
        </button>
      </nav>
    </div>
  );
}
