import { useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS, parsePositiveInteger } from '../utils/pagination';

/**
 * Lee y escribe el estado de la tabla en la URL:
 *   ?page=2&limit=20&q=pizza&cuisine=Italian&difficulty=Easy
 * Así el enlace se puede compartir y el botón "atrás" del navegador funciona.
 */
export function useTableParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parsePositiveInteger(searchParams.get('page'), 1);
  const requestedLimit = parsePositiveInteger(searchParams.get('limit'), DEFAULT_PAGE_SIZE);
  const limit = PAGE_SIZE_OPTIONS.includes(requestedLimit) ? requestedLimit : DEFAULT_PAGE_SIZE;
  const search = searchParams.get('q') ?? '';
  const cuisine = searchParams.get('cuisine') ?? '';
  const difficulty = searchParams.get('difficulty') ?? '';

  const updateParams = useCallback(
    (changes, { replace = false } = {}) => {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);
          Object.entries(changes).forEach(([key, value]) => {
            if (value === '' || value === null || value === undefined) next.delete(key);
            else next.set(key, String(value));
          });
          return next;
        },
        { replace },
      );
    },
    [setSearchParams],
  );

  // Asegura que page y limit siempre se vean en la URL (y corrige valores inválidos).
  const pageParam = searchParams.get('page');
  const limitParam = searchParams.get('limit');
  useEffect(() => {
    if (pageParam !== String(page) || limitParam !== String(limit)) {
      updateParams({ page, limit }, { replace: true });
    }
  }, [pageParam, limitParam, page, limit, updateParams]);

  return {
    page,
    limit,
    search,
    cuisine,
    difficulty,
    hasActiveFilters: Boolean(search || cuisine || difficulty),
    setPage: (newPage, options) => updateParams({ page: newPage }, options),
    setLimit: (newLimit) => updateParams({ limit: newLimit, page: 1 }),
    // La búsqueda reemplaza la entrada del historial para no crear una por cada tecla.
    setSearch: (text) => updateParams({ q: text, page: 1 }, { replace: true }),
    setCuisine: (value) => updateParams({ cuisine: value, page: 1 }),
    setDifficulty: (value) => updateParams({ difficulty: value, page: 1 }),
    clearFilters: () => updateParams({ q: '', cuisine: '', difficulty: '', page: 1 }),
  };
}
