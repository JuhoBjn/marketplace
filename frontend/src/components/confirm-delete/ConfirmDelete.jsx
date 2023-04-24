import Button from "../button/Button";

import "./ConfirmDelete.css";

const ConfirmDelete = ({ confirm, cancel, listingId }) => {
  return (
    <div className='confirm-delete__container'>
      <h3>Are you sure you want to delete the listing?</h3>
      <div className='confirm-delete__actions'>
        <Button type='delete' onClick={() => confirm(listingId)}>
          Delete listing
        </Button>
        <Button type='action' onClick={cancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default ConfirmDelete;
