/**
 * Capa de acceso a la API (DummyJSON).
 * Todos los componentes usan estas funciones en lugar de llamar a fetch directamente.
 */

const API_BASE_URL = 'https://dummyjson.com';

/** Error con un mensaje legible para el usuario y el código HTTP de la respuesta. */
export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request(path, { method = 'GET', body, signal } = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      signal,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new ApiError(
      'No se pudo conectar con el servidor. Revisa tu conexión a internet e inténtalo de nuevo.',
    );
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new ApiError(
      data?.message || `El servidor respondió con un error (${response.status}).`,
      response.status,
    );
  }

  return data;
}

/* ---------------------------------- Auth ---------------------------------- */

/** Busca el username que corresponde a un correo (para permitir iniciar sesión con correo). */
async function findUsernameByEmail(email) {
  const query = new URLSearchParams({ key: 'email', value: email, select: 'username' });
  const data = await request(`/users/filter?${query}`);
  return data?.users?.[0]?.username ?? null;
}

/**
 * Inicia sesión con DummyJSON.
 * Acepta usuario o correo: si recibe un correo, primero busca el username asociado.
 */
export async function loginUser({ usernameOrEmail, password }) {
  const invalidCredentialsError = new ApiError('Usuario o contraseña incorrectos.', 400);

  let username = usernameOrEmail;
  if (usernameOrEmail.includes('@')) {
    username = await findUsernameByEmail(usernameOrEmail);
    if (!username) throw invalidCredentialsError;
  }

  try {
    return await request('/auth/login', {
      method: 'POST',
      body: { username, password, expiresInMins: 60 },
    });
  } catch (error) {
    if (error instanceof ApiError && (error.status === 400 || error.status === 401)) {
      throw invalidCredentialsError;
    }
    throw error;
  }
}

/* --------------------------------- Recetas -------------------------------- */

/** Obtiene todas las recetas (limit=0 devuelve el conjunto completo). */
export async function getAllRecipes({ signal } = {}) {
  const data = await request('/recipes?limit=0', { signal });
  return data.recipes ?? [];
}

/** POST /recipes/add — DummyJSON simula la creación y responde con el registro nuevo. */
export function createRecipe(recipe) {
  return request('/recipes/add', { method: 'POST', body: recipe });
}

/** PUT /recipes/:id — DummyJSON simula la actualización y responde con el registro modificado. */
export function updateRecipe(recipeId, changes) {
  return request(`/recipes/${recipeId}`, { method: 'PUT', body: changes });
}

/** DELETE /recipes/:id — DummyJSON responde con el registro e isDeleted: true. */
export function deleteRecipe(recipeId) {
  return request(`/recipes/${recipeId}`, { method: 'DELETE' });
}
