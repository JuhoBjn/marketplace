import { useRef } from "react";
import CloseIcon from "@mui/icons-material/Close";

import Button from "../button/Button";

import "./ListingForm.css";

const ListingForm = ({ createListingHandler, hideModalHandler }) => {
  const titleRef = useRef("");
  const descriptionRef = useRef("");
  const priceRef = useRef(0);
  const pictureUrlRef = useRef("");

  const submitHandler = (event) => {
    event.preventDefault();

    createListingHandler(
      titleRef.current.value,
      descriptionRef.current.value,
      priceRef.current.value,
      pictureUrlRef.current.value
    );
  };

  return (
    <div className='listing-form__container'>
      <div
        className='listing-form__close-button-container'
        onClick={hideModalHandler}
      >
        <CloseIcon fontSize='large' color='action' />
      </div>
      <form onSubmit={submitHandler}>
        <label htmlFor='title'>Title</label>
        <input
          id='title'
          data-testid='title-input'
          type='text'
          placeholder='Enter listing title'
          ref={titleRef}
          required
        />
        <label htmlFor='description'>Description</label>
        <textarea
          id='description'
          data-testid='description-input'
          type='textarea'
          placeholder='Enter listing description'
          maxLength='250'
          wrap='soft'
          ref={descriptionRef}
          required
        />
        <label htmlFor='price'>Price</label>
        <input
          id='price'
          data-testid='price-input'
          type='number'
          placeholder='Enter price'
          step="0.01"
          min="0"
          ref={priceRef}
          required
        />
        <label htmlFor='picture-url'>Picture URL</label>
        <input
          id='picture-url'
          data-testid='picture-url-input'
          type='text'
          placeholder='Enter picture URL'
          ref={pictureUrlRef}
          required
        />
        <Button data-testid='submit-button' type='action'>
          Create listing
        </Button>
      </form>
    </div>
  );
};

export default ListingForm;
