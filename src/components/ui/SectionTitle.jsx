import "../../styles/sectionTitle.css";

function SectionTitle({
  badge,
  title,
  subtitle,
  align = "center",
  light = false,
}) {
  return (
    <div
      className={`section-title section-${align} ${
        light ? "section-light" : ""
      }`}
    >
      {badge && (
        <span className="section-badge">
          {badge}
        </span>
      )}

      <h2 className="section-heading">
        {title}
      </h2>

      {subtitle && (
        <p className="section-description">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default SectionTitle;