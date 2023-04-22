/* eslint-disable no-undef */
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import NavBar from "./NavBar";

describe("The navbar component", () => {
  it("should have title with text 'Marketplace'", () => {
    render(
      <BrowserRouter>
        <NavBar />
      </BrowserRouter>
    );

    expect(screen.getByRole("heading")).toBeInTheDocument();
  });
  it("should show links 'Authenticate', 'Listings' and 'Own listings'", () => {
    render(
      <BrowserRouter>
        <NavBar />
      </BrowserRouter>
    );

    expect(screen.getByText("Authenticate")).toHaveAttribute("href", "/authenticate");
    expect(screen.getByText("Listings")).toHaveAttribute("href", "/");
    expect(screen.getByText("Own listings")).toHaveAttribute("href", "/mylistings");
  });
});
