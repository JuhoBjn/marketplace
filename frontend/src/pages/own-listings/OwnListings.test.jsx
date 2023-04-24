import { render, screen } from "@testing-library/react";

import OwnListings from "./OwnListings";

import { AuthContext } from "../../utils/AuthContext";

describe("The own listings page", () => {
  it("should contain button to add new listing when logged in", () => {
    render(
      <AuthContext.Provider
        value={{
          id: "6c189af9-5168-49db-823b-34c3738d31c4",
          firstname: "Tommy",
          lastname: "Test",
          email: "tommy@test.com",
          token:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZjMTg5YWY5LTUxNjgtNDlkYi04MjNiLTM0YzM3MzhkMzFjNCIsImZpcnN0bmFtZSI6IlRvbW15IiwibGFzdG5hbWUiOiJUZXN0IiwiZW1haWwiOiJ0b21teUB0ZXN0LmNvbSIsImlhdCI6MTY4MjM3NzcxNywiZXhwIjoxNjgyMzgxMzE3fQ.GPPKL04-B5Z9WJd1CvLEMSY7lrfeNqjXFaX1GX5kMhI",
        }}
      >
        <OwnListings />
      </AuthContext.Provider>
    );

    expect(
      screen.getByRole("button", { name: "New listing" })
    ).toBeInTheDocument();
  });

  it("should not contain a button to add a new listing when not logged in", () => {
    render(<OwnListings />);

    expect(
      screen.queryByRole("button", { name: "New listing" })
    ).not.toBeInTheDocument();
  });

  it("should have Listings container", () => {
    render(<OwnListings />);

    expect(screen.getByTestId("listings-container")).toBeInTheDocument();
  });
});
