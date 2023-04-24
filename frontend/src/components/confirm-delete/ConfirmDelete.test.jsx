import { render, screen } from "@testing-library/react";

import ConfirmDelete from "./ConfirmDelete";

describe("The confirm delete form", () => {
  it("should display message and buttons to confirm or cancel", () => {
    render(<ConfirmDelete />);

    expect(
      screen.getByText("Are you sure you want to delete the listing?")
    ).toBeInTheDocument();
    expect(screen.getByText("Delete listing")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });
});
