import "./Button.css";

const Button = ({ type, onClick, children }) => {
  return (
    <div className="button-container">
      <button className={`button ${type || "action"}`} onClick={onClick}>
        {children}
      </button>
    </div>
  );
};

export default Button;
