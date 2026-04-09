export const WinMessage = ({ moves, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="win-modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>

        <h2>Congratulations!</h2>
        <p>You completed the game in {moves} moves!</p>
      </div>
    </div>
  );
};