import { useState, useEffect } from "react";

import Button from "../../components/button/Button";
import ListingList from "../../components/listing-list/ListingList";
import ListingLarge from "../../components/listing-large/ListingLarge";
import Modal from "../../components/modal/Modal";
import Backdrop from "../../components/backdrop/Backdrop";
import { fetchAll } from "../../utils/ListingsAPI";

import "./Listings.css";

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [modalContent, setModalContent] = useState({});
  const [showModal, setShowModal] = useState(false);

  const editListing = () => {
    console.log("Edit listing button was pressed");
  };

  const deleteListing = () => {
    console.log("Delete listing button was pressed");
  };

  const hideLargeListing = () => {
    setShowModal(false);
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
        closeHandler={hideLargeListing}
        editHandler={editListing}
        deleteHandler={deleteListing}
      />
    );
    setShowModal(true);
  };

  useEffect(() => {
    const fetchListings = async () => {
      const response = await fetchAll();
      if (response === "No listings found") {
        setListings([]);
      }
      setListings(response);
    };
    fetchListings();
  }, []);

  return (
    <div className='listings-page center'>
      {showModal && (
        <>
          <Modal size={"large"}>{modalContent}</Modal>
          <Backdrop onClick={hideLargeListing} />
        </>
      )}
      <div className='listings-header'>
        <Button type={"action"}>New listing</Button>
      </div>
      <ListingList
        listings={listings}
        showLargeListingHandler={showLargeListing}
      />
    </div>
  );
};

export default Listings;
