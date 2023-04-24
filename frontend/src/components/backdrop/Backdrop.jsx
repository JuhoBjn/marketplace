import ReactDOM from "react-dom";

import "./Backdrop.css";

const Backdrop = ({ onClick }) => {
  return ReactDOM.createPortal(
    <div className='modal-backdrop' onClick={onClick} />,
    document.getElementById("backdrop-hook")
  );
};

export default Backdrop;
