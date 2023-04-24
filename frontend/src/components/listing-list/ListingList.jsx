import Card from "../card/Card";
import ListingSmall from "../listing-small/ListingSmall";

import "./ListingList.css";

const ListingList = ({ listings, showLargeListingHandler }) => {
  if (listings.length === 0) {
    return <h2>No listings found.</h2>;
  }
  return (
    <ul className='listing-list'>
      {listings.map((listing) => (
        <Card
          onClick={() => showLargeListingHandler(listing.id)}
          key={listing.id}
        >
          <ListingSmall
            key={listing.id}
            title={listing.title}
            price={listing.price}
            pictureUrl={listing.picture_url}
            firstname={listing.firstname}
            lastname={listing.lastname}
          />
        </Card>
      ))}
    </ul>
  );
};

export default ListingList;
