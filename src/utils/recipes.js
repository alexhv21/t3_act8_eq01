/** Utilidades para mostrar y transformar recetas. */

export const DIFFICULTY_LABELS = {
  Easy: 'Fácil',
  Medium: 'Media',
  Hard: 'Difícil',
};

export const DIFFICULTY_OPTIONS = Object.keys(DIFFICULTY_LABELS);

const CUISINE_LABELS = {
  American: 'Estadounidense',
  Asian: 'Asiática',
  Brazilian: 'Brasileña',
  Cocktail: 'Coctelería',
  Greek: 'Griega',
  Hawaiian: 'Hawaiana',
  Indian: 'India',
  Italian: 'Italiana',
  Japanese: 'Japonesa',
  Korean: 'Coreana',
  Lebanese: 'Libanesa',
  Mediterranean: 'Mediterránea',
  Mexican: 'Mexicana',
  Moroccan: 'Marroquí',
  Oaxacan: 'Oaxaqueña',
  Pakistani: 'Pakistaní',
  Russian: 'Rusa',
  Smoothie: 'Smoothies',
  Spanish: 'Española',
  Thai: 'Tailandesa',
  Turkish: 'Turca',
  Vietnamese: 'Vietnamita',
};

export const MEAL_TYPE_OPTIONS = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Beverage', 'Side Dish', 'Appetizer'];

const MEAL_TYPE_LABELS = {
  Breakfast: 'Desayuno',
  Lunch: 'Comida',
  Dinner: 'Cena',
  Snack: 'Botana',
  Dessert: 'Postre',
  Beverage: 'Bebida',
  'Side Dish': 'Guarnición',
  Appetizer: 'Entrada',
};

export const getCuisineLabel = (cuisine) => CUISINE_LABELS[cuisine] ?? cuisine ?? '—';
export const getDifficultyLabel = (difficulty) => DIFFICULTY_LABELS[difficulty] ?? difficulty ?? '—';
export const getMealTypeLabel = (mealType) => MEAL_TYPE_LABELS[mealType] ?? mealType;

export function getTotalMinutes(recipe) {
  return (Number(recipe.prepTimeMinutes) || 0) + (Number(recipe.cookTimeMinutes) || 0);
}

export function formatMinutes(totalMinutes) {
  if (!totalMinutes) return '—';
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (!hours) return `${minutes} min`;
  return minutes ? `${hours} h ${minutes} min` : `${hours} h`;
}

/** Quita acentos y pasa a minúsculas para que la búsqueda no dependa de ellos. */
export function normalizeText(text = '') {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

/** Valores vacíos del formulario de receta. */
export const EMPTY_RECIPE_FORM = {
  name: '',
  cuisine: '',
  mealType: 'Lunch',
  difficulty: 'Easy',
  prepTimeMinutes: '',
  cookTimeMinutes: '',
  servings: '',
  image: '',
};

/** Convierte una receta de la API a los valores que usa el formulario. */
export function recipeToFormValues(recipe) {
  return {
    name: recipe.name ?? '',
    cuisine: recipe.cuisine ?? '',
    mealType: recipe.mealType?.[0] ?? 'Lunch',
    difficulty: recipe.difficulty ?? 'Easy',
    prepTimeMinutes: String(recipe.prepTimeMinutes ?? ''),
    cookTimeMinutes: String(recipe.cookTimeMinutes ?? ''),
    servings: String(recipe.servings ?? ''),
    image: recipe.image ?? '',
  };
}

/** Convierte los valores del formulario al cuerpo que se envía a la API. */
export function formValuesToPayload(values) {
  const payload = {
    name: values.name.trim(),
    cuisine: values.cuisine.trim(),
    mealType: [values.mealType],
    difficulty: values.difficulty,
    prepTimeMinutes: Number(values.prepTimeMinutes),
    cookTimeMinutes: Number(values.cookTimeMinutes),
    servings: Number(values.servings),
  };
  if (values.image.trim()) payload.image = values.image.trim();
  return payload;
}

/** Valida el formulario de receta y regresa un objeto { campo: mensaje }. */
export function validateRecipeForm(values) {
  const errors = {};
  const name = values.name.trim();

  if (!name) errors.name = 'El nombre de la receta es obligatorio.';
  else if (name.length < 3) errors.name = 'El nombre debe tener al menos 3 caracteres.';
  else if (name.length > 80) errors.name = 'El nombre no puede pasar de 80 caracteres.';

  if (!values.cuisine.trim()) errors.cuisine = 'Indica el tipo de cocina.';

  const numberRules = [
    ['prepTimeMinutes', 'El tiempo de preparación', 0, 600],
    ['cookTimeMinutes', 'El tiempo de cocción', 0, 1440],
    ['servings', 'Las porciones', 1, 100],
  ];
  for (const [field, label, min, max] of numberRules) {
    const raw = String(values[field]).trim();
    const value = Number(raw);
    if (raw === '') errors[field] = `${label} es obligatorio.`;
    else if (!Number.isInteger(value)) errors[field] = `${label} debe ser un número entero.`;
    else if (value < min || value > max) errors[field] = `${label} debe estar entre ${min} y ${max}.`;
  }

  if (values.image.trim() && !/^https?:\/\/\S+$/i.test(values.image.trim())) {
    errors.image = 'Escribe una URL válida que empiece con http:// o https://';
  }

  return errors;
}
