import { useEffect, useRef } from 'react';
import Icon from './Icon';

/** Ventana modal reutilizable. Se cierra con Esc o al hacer clic fuera (si no está ocupada). */
export default function Modal({ title, description, onClose, children, footer, size = 'md', isBusy = false }) {
  const dialogRef = useRef(null);
  const isBusyRef = useRef(isBusy);
  const onCloseRef = useRef(onClose);
  isBusyRef.current = isBusy;
  onCloseRef.current = onClose;

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const firstField = dialogRef.current?.querySelector('input, select, textarea, button:not(.modal__close)');
    (firstField ?? dialogRef.current)?.focus();

    const handleKeyDown = (event) => {
      if (event.key !== 'Escape' || isBusyRef.current) return;
      // Si hay varios modales abiertos, solo se cierra el de hasta arriba.
      const overlays = document.querySelectorAll('.modal-overlay');
      const topOverlay = overlays[overlays.length - 1];
      if (topOverlay?.contains(dialogRef.current)) onCloseRef.current();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus?.();
    };
  }, []);

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget && !isBusy) onClose();
  };

  return (
    <div className="modal-overlay" onMouseDown={handleOverlayClick}>
      <div
        ref={dialogRef}
        className={`modal modal--${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
      >
        <header className="modal__header">
          <div>
            <h2 id="modal-title" className="modal__title">{title}</h2>
            {description && <p className="modal__description">{description}</p>}
          </div>
          <button type="button" className="modal__close" onClick={onClose} disabled={isBusy} aria-label="Cerrar">
            <Icon name="x" size={18} />
          </button>
        </header>
        <div className="modal__body">{children}</div>
        {footer && <footer className="modal__footer">{footer}</footer>}
      </div>
    </div>
  );
}
