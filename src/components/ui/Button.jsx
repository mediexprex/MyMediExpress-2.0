import { NavLink } from "react-router-dom";
import "../../styles/button.css";

function Button({
  children,
  to,
  onClick,
  type = "button",
  variant = "primary",
  size = "medium",
  fullWidth = false,
  disabled = false,
  icon = null,
}) {

  const className = [
    "btn",
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth ? "btn-full" : "",
    disabled ? "btn-disabled" : "",
  ]
    .filter(Boolean)
    .join(" ");

  // React Router Link
  if (to) {
    return (
      <NavLink
        to={to}
        className={className}
        onClick={disabled ? (e) => e.preventDefault() : onClick}
      >
        {icon && (
          <span className="btn-icon">
            {icon}
          </span>
        )}

        <span>{children}</span>
      </NavLink>
    );
  }

  // Normal Button
  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && (
        <span className="btn-icon">
          {icon}
        </span>
      )}

      <span>{children}</span>
    </button>
  );
}

export default Button;