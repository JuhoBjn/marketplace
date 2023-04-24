import ReactDOM from "react-dom";

import "./Modal.css";

const Modal = ({ size, children }) => {
  return ReactDOM.createPortal(
    <div className={`modal (${size || "small"})`}>{children}</div>,
    document.getElementById("modal-hook")
  );
};

export default Modal;
