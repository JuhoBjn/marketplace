import "./ListingSmall.css";

const ListingSmall = ({ title, price, pictureUrl, firstname, lastname }) => {
  return (
    <div className='listing-small' data-testid='listing-small'>
      <div className='listing-small__img-container'>
        <img src={pictureUrl} alt={title} />
      </div>
      <div className='listing-small__info-container'>
        <h2>{title}</h2>
        <p>{price} €</p>
        <p>{`${firstname} ${lastname}`}</p>
      </div>
    </div>
  );
};

export default ListingSmall;
