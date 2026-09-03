import './ConfirmModal.css'

interface ConfirmModalProps {
  title: string
  message: string
  confirmLabel: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

function ConfirmModal({
  title,
  message,
  confirmLabel,
  cancelLabel = 'Nevermind',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <div className="confirm-modal__overlay" onClick={onCancel}>
      <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="confirm-modal__title">{title}</h2>
        <p className="confirm-modal__message">{message}</p>
        <button className="btn btn--primary" onClick={onConfirm}>
          {confirmLabel}
        </button>
        <button className="btn btn--outline" onClick={onCancel}>
          {cancelLabel}
        </button>
      </div>
    </div>
  )
}

export default ConfirmModal