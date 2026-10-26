import { useContext } from 'react';
import { RecipesContext } from '../context/RecipesContext';

export function useRecipes() {
  const context = useContext(RecipesContext);
  if (!context) throw new Error('useRecipes debe usarse dentro de <RecipesProvider>');
  return context;
}
