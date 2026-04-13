import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import DataTables from "../../../src/components/DataTables";

describe("DataTables page", () => {
  it("renders table and supports search", async () => {
    render(
      <BrowserRouter>
        <DataTables />
      </BrowserRouter>
    );

    await waitFor(() =>
      expect(screen.getByRole("heading", { name: "YouTube Top Songs" })).toBeInTheDocument()
    );

    const search = screen.getByPlaceholderText("Search songs, channels, categories");
    await userEvent.type(search, "Taylor");

    expect(screen.getByText(/Showing/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Export CSV" })).toBeInTheDocument();
  });
});
