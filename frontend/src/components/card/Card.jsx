import "./Card.css";

const Card = ({ onClick, children }) => {
  return (
    <div className='card' onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;
