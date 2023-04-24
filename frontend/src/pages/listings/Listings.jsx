import { useState, useEffect, useContext } from "react";

import Button from "../../components/button/Button";
import ListingList from "../../components/listing-list/ListingList";
import ListingLarge from "../../components/listing-large/ListingLarge";
import Modal from "../../components/modal/Modal";
import Backdrop from "../../components/backdrop/Backdrop";
import Loading from "../../components/loading/LoadingBar";
import ListingForm from "../../components/listing-form/ListingForm";
import { fetchAll, createListing } from "../../utils/ListingsAPI";

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
    setListings((prevState) => [...prevState, response]);
    setShowModal(false);
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

  const deleteListing = () => {
    console.log("Delete listing button was pressed");
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
        deleteHandler={deleteListing}
      />
    );
    setShowModal(true);
  };

  useEffect(() => {
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
        <Button type={"action"} onClick={showCreateListing}>
          New listing
        </Button>
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
