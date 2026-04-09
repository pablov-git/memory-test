export const GameHeader = ({
  score,
  moves,
  onReset,
  boardSize,
  boardOptions,
  onBoardSizeChange,
}) => {
  const showBoardSelector = boardOptions.length > 1;

  return (
    <div className="game-header">
      <h1>Memotest</h1>

      <div className="controls-row">
        {showBoardSelector && (
          <select
            className="size-select"
            value={boardSize}
            onChange={(e) => onBoardSizeChange(Number(e.target.value))}
            aria-label="Board size"
          >
            {boardOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}

        <button className="reset-btn" onClick={() => onReset()}>
          New Game
        </button>
      </div>

      <div className="stats">
        <div className="stat-item">
          <span className="stat-label">Score:</span>{" "}
          <span className="stat-value">{score}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Moves:</span>{" "}
          <span className="stat-value">{moves}</span>
        </div>
      </div>
    </div>
  );
};