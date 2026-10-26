import { useState } from 'react';
import Modal from '../ui/Modal';
import {
  DIFFICULTY_OPTIONS,
  EMPTY_RECIPE_FORM,
  MEAL_TYPE_OPTIONS,
  getDifficultyLabel,
  getMealTypeLabel,
  validateRecipeForm,
} from '../../utils/recipes';

/** Formulario para agregar o editar una receta (con validación de campos). */
export default function RecipeFormModal({ mode, initialValues, cuisineSuggestions = [], isSaving, onSubmit, onClose }) {
  const [values, setValues] = useState(initialValues ?? EMPTY_RECIPE_FORM);
  const [errors, setErrors] = useState({});
  const isEditMode = mode === 'edit';

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validateRecipeForm(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    onSubmit(values);
  };

  const fieldProps = (name) => ({
    id: `recipe-${name}`,
    name,
    value: values[name],
    onChange: handleChange,
    disabled: isSaving,
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': errors[name] ? `recipe-${name}-error` : undefined,
    className: `input ${errors[name] ? 'input--error' : ''}`,
  });

  const fieldError = (name) =>
    errors[name] ? (
      <span id={`recipe-${name}-error`} className="field__error">
        {errors[name]}
      </span>
    ) : null;

  return (
    <Modal
      title={isEditMode ? 'Editar receta' : 'Agregar receta'}
      description={
        isEditMode
          ? 'Modifica los datos y guarda. Te pediremos confirmar antes de aplicar los cambios.'
          : 'Completa los datos de la nueva receta. Los campos con * son obligatorios.'
      }
      onClose={onClose}
      isBusy={isSaving}
      footer={
        <>
          <button type="button" className="btn btn--outline" onClick={onClose} disabled={isSaving}>
            Cancelar
          </button>
          <button type="submit" form="recipe-form" className="btn btn--primary" disabled={isSaving}>
            {isSaving && <span className="spinner spinner--sm" aria-hidden="true" />}
            {isSaving ? 'Guardando…' : isEditMode ? 'Guardar cambios' : 'Agregar receta'}
          </button>
        </>
      }
    >
      <form id="recipe-form" className="form-grid" onSubmit={handleSubmit} noValidate>
        <label className="field field--full" htmlFor="recipe-name">
          <span className="field__label">Nombre de la receta *</span>
          <input type="text" placeholder="Ej. Mole negro oaxaqueño" maxLength={80} {...fieldProps('name')} />
          {fieldError('name')}
        </label>

        <label className="field" htmlFor="recipe-cuisine">
          <span className="field__label">Tipo de cocina *</span>
          <input type="text" list="cuisine-options" placeholder="Ej. Mexican" {...fieldProps('cuisine')} />
          <datalist id="cuisine-options">
            {cuisineSuggestions.map((cuisine) => (
              <option key={cuisine} value={cuisine} />
            ))}
          </datalist>
          {fieldError('cuisine')}
        </label>

        <label className="field" htmlFor="recipe-mealType">
          <span className="field__label">Tipo de platillo</span>
          <select {...fieldProps('mealType')}>
            {MEAL_TYPE_OPTIONS.map((mealType) => (
              <option key={mealType} value={mealType}>
                {getMealTypeLabel(mealType)}
              </option>
            ))}
          </select>
        </label>

        <label className="field" htmlFor="recipe-difficulty">
          <span className="field__label">Dificultad</span>
          <select {...fieldProps('difficulty')}>
            {DIFFICULTY_OPTIONS.map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {getDifficultyLabel(difficulty)}
              </option>
            ))}
          </select>
        </label>

        <label className="field" htmlFor="recipe-servings">
          <span className="field__label">Porciones *</span>
          <input type="number" min="1" max="100" placeholder="4" {...fieldProps('servings')} />
          {fieldError('servings')}
        </label>

        <label className="field" htmlFor="recipe-prepTimeMinutes">
          <span className="field__label">Preparación (min) *</span>
          <input type="number" min="0" placeholder="20" {...fieldProps('prepTimeMinutes')} />
          {fieldError('prepTimeMinutes')}
        </label>

        <label className="field" htmlFor="recipe-cookTimeMinutes">
          <span className="field__label">Cocción (min) *</span>
          <input type="number" min="0" placeholder="45" {...fieldProps('cookTimeMinutes')} />
          {fieldError('cookTimeMinutes')}
        </label>

        <label className="field field--full" htmlFor="recipe-image">
          <span className="field__label">URL de la imagen (opcional)</span>
          <input type="url" placeholder="https://…" {...fieldProps('image')} />
          {fieldError('image')}
        </label>
      </form>
    </Modal>
  );
}
