import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Icon from '../components/ui/Icon';
import Logo from '../components/ui/Logo';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Valida los campos antes de enviar la petición. */
function validateLoginForm({ usernameOrEmail, password }) {
  const errors = {};
  const user = usernameOrEmail.trim();

  if (!user) errors.usernameOrEmail = 'Ingresa tu usuario o correo electrónico.';
  else if (user.includes('@') && !EMAIL_PATTERN.test(user)) errors.usernameOrEmail = 'El correo no tiene un formato válido.';
  else if (user.length < 3) errors.usernameOrEmail = 'El usuario debe tener al menos 3 caracteres.';

  if (!password) errors.password = 'Ingresa tu contraseña.';
  else if (password.length < 4) errors.password = 'La contraseña debe tener al menos 4 caracteres.';

  return errors;
}

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const location = useLocation();

  const [formValues, setFormValues] = useState({ usernameOrEmail: '', password: '', remember: false });
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // A dónde ir después de entrar (la página que se intentó abrir sin sesión, o el inicio).
  const redirectTo = location.state?.from?.pathname
    ? `${location.state.from.pathname}${location.state.from.search ?? ''}`
    : '/';

  // Con sesión iniciada no tiene caso mostrar el login: cambia a la vista del sistema.
  if (isAuthenticated) return <Navigate to={redirectTo} replace />;

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormValues((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
    if (fieldErrors[name]) setFieldErrors((current) => ({ ...current, [name]: undefined }));
    if (submitError) setSubmitError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const credentials = { ...formValues, usernameOrEmail: formValues.usernameOrEmail.trim() };

    const errors = validateLoginForm(credentials);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    setSubmitError('');
    try {
      // Guarda al usuario en el estado; al cambiar, este componente redirige al sistema.
      await login(credentials);
    } catch (error) {
      setSubmitError(error.message || 'No se pudo iniciar sesión. Inténtalo de nuevo.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login">
      <section className="login__brand" aria-hidden="true">
        <Logo variant="dark" />
        <div className="login__brand-body">
          <h1 className="login__brand-title">Cuida el recetario de Oaxaca.</h1>
          <p className="login__brand-text">
            Administra recetas, usuarios, comentarios y reportes de la comunidad desde un solo lugar.
          </p>
          <ul className="login__features">
            <li><span><Icon name="book" size={18} /></span>Revisa y publica recetas nuevas</li>
            <li><span><Icon name="users" size={18} /></span>Gestiona cuentas de usuarios</li>
            <li><span><Icon name="chart" size={18} /></span>Consulta estadísticas del recetario</li>
          </ul>
        </div>
        <p className="login__brand-footer">
          <Icon name="shield" size={16} /> Acceso exclusivo para personal autorizado
        </p>
      </section>

      <section className="login__panel">
        <div className="login__mobile-logo">
          <Logo />
        </div>

        <form className="login-card" onSubmit={handleSubmit} noValidate>
          <div className="login-card__header">
            <h2 className="login-card__title">Iniciar sesión</h2>
            <p className="login-card__subtitle">Ingresa tus datos para acceder al panel.</p>
          </div>

          {submitError && (
            <div className="alert alert--error" role="alert">
              <Icon name="alert" size={18} />
              <span>{submitError}</span>
            </div>
          )}

          <div className="field">
            <label className="field__label" htmlFor="usernameOrEmail">Usuario o correo electrónico</label>
            <div className={`input-icon ${fieldErrors.usernameOrEmail ? 'input-icon--error' : ''}`}>
              <Icon name="user" size={18} />
              <input
                id="usernameOrEmail"
                name="usernameOrEmail"
                type="text"
                autoComplete="username"
                placeholder="emilys o emily.johnson@x.dummyjson.com"
                value={formValues.usernameOrEmail}
                onChange={handleChange}
                disabled={isSubmitting}
                aria-invalid={Boolean(fieldErrors.usernameOrEmail)}
                aria-describedby={fieldErrors.usernameOrEmail ? 'usernameOrEmail-error' : undefined}
              />
            </div>
            {fieldErrors.usernameOrEmail && (
              <span id="usernameOrEmail-error" className="field__error">{fieldErrors.usernameOrEmail}</span>
            )}
          </div>

          <div className="field">
            <label className="field__label" htmlFor="password">Contraseña</label>
            <div className={`input-icon ${fieldErrors.password ? 'input-icon--error' : ''}`}>
              <Icon name="lock" size={18} />
              <input
                id="password"
                name="password"
                type={isPasswordVisible ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Tu contraseña"
                value={formValues.password}
                onChange={handleChange}
                disabled={isSubmitting}
                aria-invalid={Boolean(fieldErrors.password)}
                aria-describedby={fieldErrors.password ? 'password-error' : undefined}
              />
              <button
                type="button"
                className="input-icon__toggle"
                onClick={() => setIsPasswordVisible((visible) => !visible)}
                aria-label={isPasswordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                <Icon name={isPasswordVisible ? 'eyeOff' : 'eye'} size={18} />
              </button>
            </div>
            {fieldErrors.password && (
              <span id="password-error" className="field__error">{fieldErrors.password}</span>
            )}
          </div>

          <div className="login-card__row">
            <label className="checkbox">
              <input type="checkbox" name="remember" checked={formValues.remember} onChange={handleChange} />
              <span className="checkbox__box"><Icon name="check" size={12} /></span>
              Recordar sesión
            </label>
            <a className="link" href="https://dummyjson.com/users" target="_blank" rel="noreferrer">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <button type="submit" className="btn btn--primary btn--lg btn--block" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="spinner spinner--sm" aria-hidden="true" /> Entrando…
              </>
            ) : (
              <>
                Entrar <Icon name="arrow" size={18} />
              </>
            )}
          </button>

          <div className="login-card__hint">
            <strong>Cuenta de prueba:</strong> usuario <code>emilys</code> · contraseña <code>emilyspass</code>
          </div>
        </form>

        <p className="login__copyright">© 2026 Sabores de Oaxaca · v1.0</p>
      </section>
    </div>
  );
}
