/* eslint-disable no-undef */
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import NavBar from "./NavBar";
import { AuthContext } from "../../utils/AuthContext";

describe("The navbar component", () => {
  it("should have title with text 'Marketplace'", () => {
    render(
      <BrowserRouter>
        <NavBar />
      </BrowserRouter>
    );

    expect(screen.getByRole("heading")).toBeInTheDocument();
  });

  it("should show links 'Authenticate' and 'Listings' when not logged in", () => {
    render(
      <BrowserRouter>
        <NavBar />
      </BrowserRouter>
    );

    expect(screen.getByText("Authenticate")).toHaveAttribute(
      "href",
      "/authenticate"
    );
    expect(screen.getByText("Listings")).toHaveAttribute("href", "/");
    expect(screen.queryByText("Own listings")).not.toBeInTheDocument();
  });

  it("should show button 'Log out', links 'Listings' and 'Own listings' when logged in", () => {
    render(
      <AuthContext.Provider
        value={{
          id: "8995eb49-eabb-40ea-ac87-0556b1f1a6fa",
          firstname: "Tommy",
          lastname: "Test",
          email: "tommy@test.com",
          token:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg5OTVlYjQ5LWVhYmItNDBlYS1hYzg3LTA1NTZiMWYxYTZmYSIsImZpcnN0bmFtZSI6IlRvbW15IiwibGFzdG5hbWUiOiJUZXN0IiwiZW1haWwiOiJ0b21teUB0ZXN0LmNvbSJ9.SyF43hultL72GPZSazTsoOMywbHNlmCrE_6vhhIgRmE",
          signup: () => {},
          login: () => {},
          logout: () => {},
        }}
      >
        <BrowserRouter>
          <NavBar />
        </BrowserRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByRole("button", { name: "Log out" })).toBeInTheDocument();
    expect(screen.getByText("Listings")).toHaveAttribute("href", "/");
    expect(screen.getByText("Own listings")).toHaveAttribute("href", "/mylistings");
  });

  it("should show user's name when logged in", () => {
    render(
      <AuthContext.Provider
        value={{
          id: "8995eb49-eabb-40ea-ac87-0556b1f1a6fa",
          firstname: "Tommy",
          lastname: "Test",
          email: "tommy@test.com",
          token:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg5OTVlYjQ5LWVhYmItNDBlYS1hYzg3LTA1NTZiMWYxYTZmYSIsImZpcnN0bmFtZSI6IlRvbW15IiwibGFzdG5hbWUiOiJUZXN0IiwiZW1haWwiOiJ0b21teUB0ZXN0LmNvbSJ9.SyF43hultL72GPZSazTsoOMywbHNlmCrE_6vhhIgRmE",
          signup: () => {},
          login: () => {},
          logout: () => {},
        }}
      >
        <BrowserRouter>
          <NavBar />
        </BrowserRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByText("Tommy Test")).toBeInTheDocument();
  })
});
