import Card from "../../components/card/Card";

import "./Listings.css";

const Listings = () => {
  return (
    <div className='listings-page center'>
      <div className="listings-header">
        <button>New listing</button>
      </div>
      <div className='listings-container'>
        <Card />
      </div>
    </div>
  );
};

export default Listings;
