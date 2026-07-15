import "../../styles/card.css";

function Card({
  children,
  className = "",
  hover = true,
  padding = "medium",
  onClick,
}) {
  const cardClass = `
    card
    ${hover ? "card-hover" : ""}
    card-${padding}
    ${className}
  `
    .replace(/\s+/g, " ")
    .trim();

  return (
    <div
      className={cardClass}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export default Card;