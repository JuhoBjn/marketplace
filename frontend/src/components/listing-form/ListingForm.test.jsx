import { render, screen} from "@testing-library/react";

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
  })

  it("should display button to create listing", () => {
    render(<ListingForm />);

    expect(screen.getByText("Create listing")).toBeInTheDocument();
  })
})