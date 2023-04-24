import { render, screen } from "@testing-library/react";

import ListingList from "./ListingList";

describe("The listing list component", () => {
  it("should show 'No listings found.' when there are no listins", () => {
    render(<ListingList listings={[]} showLargeListingHandler={() => {}} />);

    expect(screen.getByText("No listings found.")).toBeInTheDocument();
  });

  it("should show a listing when there is one", () => {
    const listings = [
      {
        id: "b54874b0-bbb5-4d97-b52f-370ae3ebb471",
        userId: "2a7cb6ea-bd9e-437e-9807-531a81d9b9b4",
        title: "Cucumber moped",
        description:
          "Selling my beloved cucumber moped, since I don't have time to ride it anymore.",
        price: "55.00",
        pictureUrl:
          "https://im.mtvuutiset.fi/image/7481386/landscape16_9/1024/576/e20bb1dea888345bbfb5a710a53f4f3d/DA/kurkkumopo.jpg",
        firstname: "Tommy",
        lastname: "Test",
        email: "tommy@test.com",
        phone: "0123456789",
      },
    ];

    render(
      <ListingList listings={listings} showLargeListingHandler={() => {}} />
    ),
      expect(screen.getByTestId("listing-small")).toBeInTheDocument();
  });
});
