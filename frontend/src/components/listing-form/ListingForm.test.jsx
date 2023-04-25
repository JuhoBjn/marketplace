import { render, screen } from "@testing-library/react";

import ListingForm from "./ListingForm";

describe("The listing creation form", () => {
  it("should display input fields for title, description, price and picture URL", () => {
    render(<ListingForm />);

    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByTestId("title-input")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByTestId("description-input")).toBeInTheDocument();
    expect(screen.getByText("Price")).toBeInTheDocument();
    expect(screen.getByTestId("price-input")).toBeInTheDocument();
    expect(screen.getByText("Picture URL")).toBeInTheDocument();
    expect(screen.getByTestId("picture-url-input")).toBeInTheDocument();
  });

  it("should display button to create listing when in listing creation mode", () => {
    render(<ListingForm updateMode={false} />);

    expect(screen.getByText("Create listing")).toBeInTheDocument();
  });

  it("should display button to update listing when in update mode", () => {
    render(<ListingForm updateMode={true} />);

    expect(screen.getByText("Update listing")).toBeInTheDocument();
  });

  it("should display given values when in update mode", () => {
    const listing = {
      id: "ffde80e5-a7bb-40c2-a2e3-1ea0d6ed7518",
      title: "Test bench",
      description: "Selling a good condition test bench.",
      price: 25500,
      pictureUrl:
        "https://cdn10.picryl.com/photo/1989/09/30/a-test-bench-in-the-electronic-technology-and-development-etandd-laboratory-3a92a4-1024.jpg",
    };
    render(
      <ListingForm
        updateMode={true}
        listingId={listing.id}
        title={listing.title}
        description={listing.description}
        price={listing.price}
        pictureUrl={listing.pictureUrl}
      />
    );

    expect(screen.getByDisplayValue(listing.title)).toBeInTheDocument();
    expect(screen.getByText(listing.description)).toBeInTheDocument();
    expect(screen.getByDisplayValue(listing.price)).toBeInTheDocument();
    expect(screen.getByDisplayValue(listing.pictureUrl)).toBeInTheDocument();
  });
});
