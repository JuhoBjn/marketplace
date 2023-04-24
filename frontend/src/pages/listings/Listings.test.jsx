import { render, screen } from "@testing-library/react";

import Listings from "./Listings";

describe("The listings page", () => {
  it("should contain button to add new listing", () => {
    render(<Listings />);

    expect(screen.getByRole("button", { name: "New listing" })).toBeInTheDocument();
  });
  
  it("should have ListingsList component", () => {
    render(<Listings />);

    expect(screen.getByTestId("listings-container")).toBeInTheDocument();
  });
});
