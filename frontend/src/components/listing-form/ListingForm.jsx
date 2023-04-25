import { useRef } from "react";
import CloseIcon from "@mui/icons-material/Close";

import Button from "../button/Button";

import "./ListingForm.css";

const ListingForm = ({
  listingId,
  title,
  description,
  price,
  pictureUrl,
  updateMode,
  createListingHandler,
  updateListingHandler,
  hideModalHandler,
}) => {
  const titleRef = useRef(updateMode ? title : "");
  const descriptionRef = useRef(updateMode ? description : "");
  const priceRef = useRef(updateMode ? price : 0.0);
  const pictureUrlRef = useRef(updateMode ? pictureUrl : "");

  const submitHandler = (event) => {
    event.preventDefault();

    if (updateMode) {
      updateListingHandler(
        listingId,
        titleRef.current.value,
        descriptionRef.current.value,
        priceRef.current.value,
        pictureUrlRef.current.value
      );
    } else {
      createListingHandler(
        titleRef.current.value,
        descriptionRef.current.value,
        priceRef.current.value,
        pictureUrlRef.current.value
      );
    }
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
          defaultValue={updateMode ? title : ""}
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
          defaultValue={updateMode ? description : ""}
          ref={descriptionRef}
          required
        />
        <label htmlFor='price'>Price</label>
        <input
          id='price'
          data-testid='price-input'
          type='number'
          placeholder='Enter price'
          step='0.01'
          min='0'
          defaultValue={updateMode ? price : 0}
          ref={priceRef}
          required
        />
        <label htmlFor='picture-url'>Picture URL</label>
        <input
          id='picture-url'
          data-testid='picture-url-input'
          type='text'
          placeholder='Enter picture URL'
          defaultValue={updateMode ? pictureUrl : ""}
          ref={pictureUrlRef}
          required
        />
        <Button data-testid='submit-button' type='action'>
          {updateMode ? "Update" : "Create"} listing
        </Button>
      </form>
    </div>
  );
};

export default ListingForm;
