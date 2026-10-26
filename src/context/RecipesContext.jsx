import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import {
  createRecipe as createRecipeRequest,
  deleteRecipe as deleteRecipeRequest,
  getAllRecipes,
  updateRecipe as updateRecipeRequest,
} from '../services/api';
import { formValuesToPayload } from '../utils/recipes';

export const RecipesContext = createContext(null);

/**
 * Guarda las recetas en el estado local.
 * Cada acción CRUD primero hace la petición real a DummyJSON (que solo la simula)
 * y después refleja el cambio en este estado para que la tabla se actualice.
 */
export function RecipesProvider({ children }) {
  const [recipes, setRecipes] = useState([]);
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const loadRecipes = useCallback(async (signal) => {
    setStatus('loading');
    setErrorMessage('');
    try {
      const data = await getAllRecipes({ signal });
      setRecipes(data);
      setStatus('success');
    } catch (error) {
      if (error.name === 'AbortError') return;
      setErrorMessage(error.message || 'No se pudieron cargar las recetas.');
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadRecipes(controller.signal);
    return () => controller.abort();
  }, [loadRecipes]);

  const handleAddRecipe = useCallback(
    async (formValues) => {
      const payload = formValuesToPayload(formValues);
      const apiResponse = await createRecipeRequest(payload);
      console.info('POST /recipes/add →', apiResponse);

      // DummyJSON siempre responde con el mismo id (total + 1), así que generamos
      // un id único localmente para no repetir llaves en la tabla.
      const nextId = recipes.reduce((max, recipe) => Math.max(max, recipe.id), 0) + 1;
      const newRecipe = {
        ingredients: [],
        instructions: [],
        tags: [],
        rating: 0,
        reviewCount: 0,
        ...apiResponse,
        ...payload,
        id: nextId,
        isLocal: true,
      };
      setRecipes((current) => [newRecipe, ...current]);
      return { recipe: newRecipe, apiResponse };
    },
    [recipes],
  );

  const handleUpdateRecipe = useCallback(
    async (recipeId, formValues) => {
      const recipe = recipes.find((item) => item.id === recipeId);
      const payload = formValuesToPayload(formValues);
      let apiResponse = null;
      let localOnly = false;

      try {
        apiResponse = await updateRecipeRequest(recipeId, payload);
        console.info(`PUT /recipes/${recipeId} →`, apiResponse);
      } catch (error) {
        // Las recetas creadas en esta sesión no existen en DummyJSON (responde 404):
        // en ese caso solo actualizamos el estado local.
        if (recipe?.isLocal && error.status === 404) localOnly = true;
        else throw error;
      }

      setRecipes((current) =>
        current.map((item) => (item.id === recipeId ? { ...item, ...payload } : item)),
      );
      return { apiResponse, localOnly };
    },
    [recipes],
  );

  const handleDeleteRecipe = useCallback(
    async (recipeId) => {
      const recipe = recipes.find((item) => item.id === recipeId);
      let apiResponse = null;
      let localOnly = false;

      try {
        apiResponse = await deleteRecipeRequest(recipeId);
        console.info(`DELETE /recipes/${recipeId} →`, apiResponse);
      } catch (error) {
        if (recipe?.isLocal && error.status === 404) localOnly = true;
        else throw error;
      }

      setRecipes((current) => current.filter((item) => item.id !== recipeId));
      return { apiResponse, localOnly };
    },
    [recipes],
  );

  const value = useMemo(
    () => ({
      recipes,
      status,
      errorMessage,
      reloadRecipes: () => loadRecipes(),
      addRecipe: handleAddRecipe,
      updateRecipe: handleUpdateRecipe,
      deleteRecipe: handleDeleteRecipe,
    }),
    [recipes, status, errorMessage, loadRecipes, handleAddRecipe, handleUpdateRecipe, handleDeleteRecipe],
  );

  return <RecipesContext.Provider value={value}>{children}</RecipesContext.Provider>;
}
