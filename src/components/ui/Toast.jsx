import { useEffect } from 'react';
import Icon from './Icon';

/** Aviso flotante para confirmar acciones o mostrar errores. */
export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(onClose, toast.type === 'error' ? 8000 : 5000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className={`toast toast--${toast.type}`} role={toast.type === 'error' ? 'alert' : 'status'}>
      <span className="toast__icon">
        <Icon name={toast.type === 'error' ? 'alert' : 'check'} size={18} />
      </span>
      <div className="toast__content">
        <p className="toast__title">{toast.title}</p>
        {toast.message && <p className="toast__message">{toast.message}</p>}
      </div>
      <button type="button" className="toast__close" onClick={onClose} aria-label="Cerrar aviso">
        <Icon name="x" size={16} />
      </button>
    </div>
  );
}
