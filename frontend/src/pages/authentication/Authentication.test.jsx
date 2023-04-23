import { render, screen } from "@testing-library/react";

import Authentication from "./Authentication";

describe("The authentication page", () => {
  it("should show signup form", () => {
    render(<Authentication />);

    expect(screen.getByText("First name")).toBeInTheDocument();
    expect(screen.getByTestId("firstname-input")).toBeInTheDocument();
    expect(screen.getByText("Last name")).toBeInTheDocument();
    expect(screen.getByTestId("lastname-input")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByTestId("email-input")).toBeInTheDocument();
    expect(screen.getByText("Phone number")).toBeInTheDocument();
    expect(screen.getByTestId("phone-input")).toBeInTheDocument();
    expect(screen.getByText("Password")).toBeInTheDocument();
    expect(screen.getByTestId("password-input")).toBeInTheDocument();
    expect(screen.getByTestId("auth-form__submit-button")).toBeInTheDocument();
    expect(screen.getByTestId("toggle-signup-mode-button")).toBeInTheDocument();
  });
});
