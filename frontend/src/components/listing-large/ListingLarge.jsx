import { useContext } from "react";
import CloseIcon from "@mui/icons-material/Close";

import Button from "../button/Button";

import { AuthContext } from "../../utils/AuthContext";

import "./ListingLarge.css";

const ListingLarge = ({
  id,
  userId,
  title,
  description,
  price,
  pictureUrl,
  firstname,
  lastname,
  email,
  phone,
  closeHandler,
  editHandler,
  deleteHandler,
}) => {
  const authContext = useContext(AuthContext);

  const isOwnListing = userId === authContext.id;

  return (
    <div className='listing-large'>
      <div className="listing-large__close-icon-container" onClick={closeHandler}>
        <CloseIcon
          fontSize='large'
          color='action'
        />
      </div>
      <div className='listing-large__img-container'>
        <img src={pictureUrl} alt={title} />
      </div>
      <div className='listing-large__info'>
        <div className='listing-large__info-top-bar'>
          <h2>{title}</h2>
          <h3>{price} €</h3>
        </div>
        <div className='listing-large__info-seller'>
          <h4>{`Seller: ${firstname} ${lastname}`}</h4>
          <p>{`Email: ${email}`}</p>
          <p>{`Phone: ${phone}`}</p>
        </div>
        <div className='listing-large__info-description'>
          <p>{description}</p>
        </div>
      </div>
      {isOwnListing && (
        <div className='listing-large__actions-container'>
          <Button type={"action"} onClick={editHandler}>
            Edit
          </Button>
          <Button type={"delete"} onClick={deleteHandler}>
            Delete
          </Button>
        </div>
      )}
    </div>
  );
};

export default ListingLarge;
