import { render, screen } from "@testing-library/react";

import ListingLarge from "./ListingLarge";
import { AuthContext } from "../../utils/AuthContext";

describe("The large listing component", () => {
  it("should show title, desc, price, image and contact info of seller", () => {
    const listing = {
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
    };

    render(
      <ListingLarge
        id={listing.id}
        userId={listing.userId}
        title={listing.title}
        description={listing.description}
        price={listing.price}
        pictureUrl={listing.pictureUrl}
        firstname={listing.firstname}
        lastname={listing.lastname}
        email={listing.email}
        phone={listing.phone}
        closeHandler={() => {}}
        editHandler={() => {}}
        deleteHandler={() => {}}
      />
    );

    expect(screen.getByAltText(listing.title)).toBeInTheDocument();
    expect(screen.getByText(listing.title)).toBeInTheDocument();
    expect(screen.getByText(`${listing.price} €`)).toBeInTheDocument();
    expect(screen.getByText(listing.description)).toBeInTheDocument();
    expect(
      screen.getByText(`Seller: ${listing.firstname} ${listing.lastname}`)
    ).toBeInTheDocument();
    expect(screen.getByText(`Email: ${listing.email}`)).toBeInTheDocument();
    expect(screen.getByText(`Phone: ${listing.phone}`)).toBeInTheDocument();
  });

  it("should show action buttons on own listing", () => {
    const listing = {
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
    };

    render(
      <AuthContext.Provider
        value={{
          id: "2a7cb6ea-bd9e-437e-9807-531a81d9b9b4",
          firstname: "Tommy",
          lastname: "Test",
          email: "tommy@test.com",
          token: "98as7df894k5j231472314234kl234j2198798sdaf",
        }}
      >
        <ListingLarge
          id={listing.id}
          userId={listing.userId}
          title={listing.title}
          description={listing.description}
          price={listing.price}
          pictureUrl={listing.pictureUrl}
          firstname={listing.firstname}
          lastname={listing.lastname}
          email={listing.email}
          phone={listing.phone}
          closeHandler={() => {}}
          editHandler={() => {}}
          deleteHandler={() => {}}
        />
      </AuthContext.Provider>
    );

    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });
});
