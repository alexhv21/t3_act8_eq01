import Icon from './Icon';
import Modal from './Modal';

/** Mensaje de confirmación antes de editar o eliminar. */
export default function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Confirmar',
  busyLabel = 'Procesando…',
  tone = 'primary', // 'primary' | 'danger'
  isBusy = false,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal
      title={title}
      onClose={onCancel}
      isBusy={isBusy}
      size="sm"
      footer={
        <>
          <button type="button" className="btn btn--outline" onClick={onCancel} disabled={isBusy}>
            Cancelar
          </button>
          <button
            type="button"
            className={`btn ${tone === 'danger' ? 'btn--danger' : 'btn--primary'}`}
            onClick={onConfirm}
            disabled={isBusy}
          >
            {isBusy && <span className="spinner spinner--sm" aria-hidden="true" />}
            {isBusy ? busyLabel : confirmLabel}
          </button>
        </>
      }
    >
      <div className={`confirm confirm--${tone}`}>
        <span className="confirm__icon">
          <Icon name={tone === 'danger' ? 'trash' : 'alert'} size={22} />
        </span>
        <div className="confirm__message">{message}</div>
      </div>
    </Modal>
  );
}
