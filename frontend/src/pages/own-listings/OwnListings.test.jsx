import { render, screen } from "@testing-library/react";

import OwnListings from "./OwnListings";

describe("The own listings page", () => {
  it("should contain button to add new listing", () => {
    render(<OwnListings />);

    expect(screen.getByRole("button", { name: "New listing" })).toBeInTheDocument();
  });
  
  it("should have ListingsList component", () => {
    render(<OwnListings />);

    expect(screen.getByTestId("listings-container")).toBeInTheDocument();
  });
});
