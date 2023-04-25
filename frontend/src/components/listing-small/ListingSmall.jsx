import "./ListingSmall.css";

const ListingSmall = ({ title, price, pictureUrl, firstname, lastname }) => {
  return (
    <div className='listing-small' data-testid='listing-small'>
      <div className='listing-small__img-container'>
        <img src={pictureUrl} alt={title} />
      </div>
      <div className='listing-small__info-container'>
        <h2>{title}</h2>
        <p data-testid='listing-small__price'>{price} €</p>
        <p data-testid='listing-small__owner'>{`${firstname} ${lastname}`}</p>
      </div>
    </div>
  );
};

export default ListingSmall;
