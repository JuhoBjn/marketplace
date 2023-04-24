import { render, screen } from "@testing-library/react";

import ListingSmall from "./ListingSmall";

describe("The small listing component", () => {
  it("should display image, title, price and seller name", () => {
    const listing = {
      title: "Test bench",
      price: 250,
      pictureUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4JKziS__hUPmNRAPcJSVapXXf9qUZmHeGhA&usqp=CAU",
      firstname: "Thomas",
      lastname: "Tester",
    };

    render(
      <ListingSmall
        title={listing.title}
        price={listing.price}
        pictureUrl={listing.pictureUrl}
        firstname={listing.firstname}
        lastname={listing.lastname}
      />
    );

    expect(screen.getByAltText(listing.title)).toBeInTheDocument();
    expect(screen.getByText(listing.title)).toBeInTheDocument();
    expect(screen.getByText(`${listing.price} €`)).toBeInTheDocument();
    expect(screen.getByText(`${listing.firstname} ${listing.lastname}`)).toBeInTheDocument();
  });
});
