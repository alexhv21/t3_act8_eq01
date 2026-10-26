import { useCallback, useEffect, useMemo, useState } from 'react';
import RecipeFormModal from '../components/recipes/RecipeFormModal';
import Pagination from '../components/table/Pagination';
import RecipesTable from '../components/table/RecipesTable';
import TableFilters from '../components/table/TableFilters';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Icon from '../components/ui/Icon';
import { EmptyState, ErrorMessage, Loader } from '../components/ui/StatusMessages';
import Toast from '../components/ui/Toast';
import { useRecipes } from '../hooks/useRecipes';
import { useTableParams } from '../hooks/useTableParams';
import { normalizeText, recipeToFormValues } from '../utils/recipes';

export default function RecipesPage() {
  const { recipes, status, errorMessage, reloadRecipes, addRecipe, updateRecipe, deleteRecipe } = useRecipes();
  const tableParams = useTableParams();
  const { page, limit, search, cuisine, difficulty, setPage } = tableParams;

  // Estado de los modales y acciones CRUD
  const [recipeForm, setRecipeForm] = useState(null); // { mode: 'create' | 'edit', recipe? }
  const [pendingEdit, setPendingEdit] = useState(null); // { recipe, values } esperando confirmación
  const [recipeToDelete, setRecipeToDelete] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const closeToast = useCallback(() => setToast(null), []);

  /* ------------------------- Filtros y paginación ------------------------- */

  const cuisineOptions = useMemo(
    () => [...new Set(recipes.map((recipe) => recipe.cuisine).filter(Boolean))].sort(),
    [recipes],
  );

  const filteredRecipes = useMemo(() => {
    const searchText = normalizeText(search);
    return recipes.filter((recipe) => {
      const matchesSearch = !searchText || normalizeText(recipe.name).includes(searchText);
      const matchesCuisine = !cuisine || recipe.cuisine === cuisine;
      const matchesDifficulty = !difficulty || recipe.difficulty === difficulty;
      return matchesSearch && matchesCuisine && matchesDifficulty;
    });
  }, [recipes, search, cuisine, difficulty]);

  const totalPages = Math.max(1, Math.ceil(filteredRecipes.length / limit));
  const currentPage = Math.min(page, totalPages);
  const visibleRecipes = filteredRecipes.slice((currentPage - 1) * limit, currentPage * limit);

  // Si la página de la URL ya no existe (p. ej. después de eliminar), corrige la URL.
  useEffect(() => {
    if (status === 'success' && page > totalPages) setPage(totalPages, { replace: true });
  }, [status, page, totalPages, setPage]);

  /* ------------------------------ Acciones CRUD ------------------------------ */

  const handleOpenCreateForm = () => setRecipeForm({ mode: 'create' });
  const handleOpenEditForm = (recipe) => setRecipeForm({ mode: 'edit', recipe });
  const handleCloseForm = () => {
    setRecipeForm(null);
    setPendingEdit(null);
  };

  const handleFormSubmit = async (values) => {
    if (recipeForm.mode === 'edit') {
      // Primero pedimos confirmación antes de editar.
      setPendingEdit({ recipe: recipeForm.recipe, values });
      return;
    }

    setIsSaving(true);
    try {
      const { recipe, apiResponse } = await addRecipe(values);
      setRecipeForm(null);
      setToast({
        type: 'success',
        title: `Se agregó "${recipe.name}"`,
        message: `POST /recipes/add respondió con id ${apiResponse.id}. Se guardó en la tabla como #${recipe.id}.`,
      });
    } catch (error) {
      setToast({ type: 'error', title: 'No se pudo agregar la receta', message: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmEditRecipe = async () => {
    const { recipe, values } = pendingEdit;
    setIsSaving(true);
    try {
      const { localOnly } = await updateRecipe(recipe.id, values);
      setPendingEdit(null);
      setRecipeForm(null);
      setToast({
        type: 'success',
        title: 'Cambios guardados',
        message: localOnly
          ? 'Esta receta solo existe en la tabla (la API respondió 404), así que se actualizó localmente.'
          : `PUT /recipes/${recipe.id} respondió correctamente y la tabla se actualizó.`,
      });
    } catch (error) {
      setPendingEdit(null);
      setToast({ type: 'error', title: 'No se pudieron guardar los cambios', message: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDeleteRecipe = async () => {
    setIsSaving(true);
    try {
      const { apiResponse, localOnly } = await deleteRecipe(recipeToDelete.id);
      setToast({
        type: 'success',
        title: `Se eliminó "${recipeToDelete.name}"`,
        message: localOnly
          ? 'Esta receta solo existía en la tabla, así que se eliminó localmente.'
          : `DELETE /recipes/${recipeToDelete.id} respondió isDeleted: ${String(apiResponse?.isDeleted)}.`,
      });
      setRecipeToDelete(null);
    } catch (error) {
      setRecipeToDelete(null);
      setToast({ type: 'error', title: 'No se pudo eliminar la receta', message: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  /* --------------------------------- Vista --------------------------------- */

  const renderTableContent = () => {
    if (status === 'loading') return <Loader message="Cargando recetas…" />;
    if (status === 'error') {
      return <ErrorMessage title="No pudimos cargar las recetas" message={errorMessage} onRetry={reloadRecipes} />;
    }
    if (filteredRecipes.length === 0) {
      return (
        <EmptyState
          title="No encontramos recetas"
          message={tableParams.hasActiveFilters ? 'Prueba con otra búsqueda o limpia los filtros.' : 'Aún no hay recetas registradas.'}
          action={
            tableParams.hasActiveFilters && (
              <button type="button" className="btn btn--outline" onClick={tableParams.clearFilters}>
                Limpiar filtros
              </button>
            )
          }
        />
      );
    }
    return (
      <>
        <RecipesTable recipes={visibleRecipes} onEdit={handleOpenEditForm} onDelete={setRecipeToDelete} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={limit}
          totalItems={filteredRecipes.length}
          onPageChange={(newPage) => {
            setPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onPageSizeChange={tableParams.setLimit}
        />
      </>
    );
  };

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1 className="page__title">Gestión de recetas</h1>
          <p className="page__subtitle">Consulta, filtra, agrega, edita y elimina recetas del recetario.</p>
        </div>
        <div className="page__actions">
          <button type="button" className="btn btn--primary" onClick={handleOpenCreateForm} disabled={status !== 'success'}>
            <Icon name="plus" size={18} /> Nueva receta
          </button>
        </div>
      </div>

      <section className="card">
        <TableFilters
          search={search}
          cuisine={cuisine}
          difficulty={difficulty}
          cuisineOptions={cuisineOptions}
          hasActiveFilters={tableParams.hasActiveFilters}
          onSearchChange={tableParams.setSearch}
          onCuisineChange={tableParams.setCuisine}
          onDifficultyChange={tableParams.setDifficulty}
          onClearFilters={tableParams.clearFilters}
        />
        {status === 'success' && (
          <p className="table-results">
            {filteredRecipes.length} {filteredRecipes.length === 1 ? 'resultado' : 'resultados'}
            {tableParams.hasActiveFilters && ` de ${recipes.length} recetas`}
          </p>
        )}
        {renderTableContent()}
      </section>

      {recipeForm && (
        <RecipeFormModal
          key={recipeForm.recipe?.id ?? 'new'}
          mode={recipeForm.mode}
          initialValues={recipeForm.recipe ? recipeToFormValues(recipeForm.recipe) : undefined}
          cuisineSuggestions={cuisineOptions}
          isSaving={isSaving && !pendingEdit}
          onSubmit={handleFormSubmit}
          onClose={handleCloseForm}
        />
      )}

      {pendingEdit && (
        <ConfirmDialog
          title="¿Guardar los cambios?"
          message={
            <p>
              Vas a modificar la receta <strong>{pendingEdit.recipe.name}</strong> (#{pendingEdit.recipe.id}).
              ¿Quieres continuar?
            </p>
          }
          confirmLabel="Sí, guardar cambios"
          busyLabel="Guardando…"
          isBusy={isSaving}
          onConfirm={handleConfirmEditRecipe}
          onCancel={() => setPendingEdit(null)}
        />
      )}

      {recipeToDelete && (
        <ConfirmDialog
          tone="danger"
          title="¿Eliminar receta?"
          message={
            <p>
              Se eliminará <strong>{recipeToDelete.name}</strong> (#{recipeToDelete.id}). Esta acción no se puede deshacer.
            </p>
          }
          confirmLabel="Sí, eliminar"
          busyLabel="Eliminando…"
          isBusy={isSaving}
          onConfirm={handleConfirmDeleteRecipe}
          onCancel={() => setRecipeToDelete(null)}
        />
      )}

      <Toast toast={toast} onClose={closeToast} />
    </div>
  );
}
