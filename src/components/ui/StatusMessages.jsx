import Icon from './Icon';

export function Loader({ message = 'Cargando…' }) {
  return (
    <div className="state-box" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <p className="state-box__title">{message}</p>
    </div>
  );
}

export function ErrorMessage({ title = 'Algo salió mal', message, onRetry }) {
  return (
    <div className="state-box state-box--error" role="alert">
      <span className="state-box__icon">
        <Icon name="alert" size={26} />
      </span>
      <p className="state-box__title">{title}</p>
      {message && <p className="state-box__text">{message}</p>}
      {onRetry && (
        <button type="button" className="btn btn--outline" onClick={onRetry}>
          <Icon name="refresh" size={16} /> Reintentar
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, message, action }) {
  return (
    <div className="state-box">
      <span className="state-box__icon state-box__icon--muted">
        <Icon name="search" size={26} />
      </span>
      <p className="state-box__title">{title}</p>
      {message && <p className="state-box__text">{message}</p>}
      {action}
    </div>
  );
}
