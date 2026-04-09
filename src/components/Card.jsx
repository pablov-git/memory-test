export const Card = ({ card, onClick }) => {
  return (
    <div
      className={`card ${card.isFlipped ? "flipped" : ""} ${
        card.isMatched ? "matched" : ""
      }`}
      onClick={() => onClick(card)}
    >
      <div className="card-front">?</div>
      <div className="card-back">
        <img
          src={`/icons/${card.value}`}
          alt=""
          style={{ width: "70%", height: "70%", objectFit: "contain" }}
        />
      </div>
    </div>
  );
};