import PropTypes from 'prop-types';

function Modal({ open, title, children, onClose }) {
  if (!open) return null;

  return (
    <div className="modal">
      <div className="modal__backdrop" onClick={onClose} role="presentation" />
      <div className="modal__content" role="dialog" aria-modal="true">
        <header className="modal__header">
          <h2>{title}</h2>
          <button type="button" className="modal__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>
        <div className="modal__body">{children}</div>
      </div>
    </div>
  );
}

Modal.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired
};

Modal.defaultProps = {
  open: false
};

export default Modal;
