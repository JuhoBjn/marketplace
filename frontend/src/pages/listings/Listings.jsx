import { useState, useEffect, useContext } from "react";

import Button from "../../components/button/Button";
import ListingList from "../../components/listing-list/ListingList";
import ListingLarge from "../../components/listing-large/ListingLarge";
import Modal from "../../components/modal/Modal";
import Backdrop from "../../components/backdrop/Backdrop";
import Loading from "../../components/loading/LoadingBar";
import ListingForm from "../../components/listing-form/ListingForm";
import ConfirmDelete from "../../components/confirm-delete/ConfirmDelete";
import {
  fetchAll,
  createListing,
  deleteListing,
} from "../../utils/ListingsAPI";

import { AuthContext } from "../../utils/AuthContext";

import "./Listings.css";

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [showModal, setShowModal] = useState(false);

  const authContext = useContext(AuthContext);

  const hideModal = () => {
    setShowModal(false);
  };

  const createListingHandler = async (
    title,
    description,
    price,
    pictureUrl
  ) => {
    const response = await createListing(
      authContext.token,
      authContext.id,
      title,
      description,
      price,
      pictureUrl
    );
    if (response.length === 0) {
      console.log("Failed to create listing.");
    }
    hideModal();
    fetchListings();
  };

  const showCreateListing = () => {
    setModalContent(
      <ListingForm
        createListingHandler={createListingHandler}
        hideModalHandler={hideModal}
      />
    );
    setShowModal(true);
  };

  const editListing = () => {
    console.log("Edit listing button was pressed");
  };

  const deleteListingHandler = async (listingId) => {
    const response = await deleteListing(
      authContext.token,
      authContext.id,
      listingId
    );
    if (response.status !== 200) {
      console.log("Could not delete listing");
    }
    hideModal();
    fetchListings();
  };

  const showDeleteListing = (listingId) => {
    setModalContent(
      <ConfirmDelete
        confirm={deleteListingHandler}
        cancel={hideModal}
        listingId={listingId}
      />
    );
    setShowModal(true);
  };

  const showLargeListing = (listingId) => {
    const listing = listings.find((listing) => {
      return listing.id === listingId;
    });
    setModalContent(
      <ListingLarge
        id={listing.id}
        userId={listing.user_id}
        title={listing.title}
        description={listing.description}
        price={listing.price}
        pictureUrl={listing.picture_url}
        firstname={listing.firstname}
        lastname={listing.lastname}
        email={listing.email}
        phone={listing.phone}
        closeHandler={hideModal}
        editHandler={editListing}
        deleteHandler={showDeleteListing}
      />
    );
    setShowModal(true);
  };

  const fetchListings = async () => {
    await setLoading(true);
    const response = await fetchAll();
    if (response === "No listings found") {
      setListings([]);
      await setLoading(false);
    }
    setListings(response);
    await setLoading(false);
  };

  useEffect(() => {
    fetchListings();
  }, []);

  return (
    <div className='listings-page center'>
      {showModal && (
        <>
          <Modal size={"large"}>{modalContent}</Modal>
          <Backdrop onClick={hideModal} />
        </>
      )}
      <div className='listings-header'>
        {!!authContext.token && (
          <Button type={"action"} onClick={showCreateListing}>
            New listing
          </Button>
        )}
      </div>
      <div className='listings-container' data-testid='listings-container'>
        {loading ? (
          <div className='center'>
            <Loading />
          </div>
        ) : (
          <ListingList
            data-testid='listings-component'
            listings={listings}
            showLargeListingHandler={showLargeListing}
          />
        )}
      </div>
    </div>
  );
};

export default Listings;
