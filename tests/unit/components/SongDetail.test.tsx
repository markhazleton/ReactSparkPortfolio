import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import SongDetail from "../../../src/components/SongDetail";

describe("SongDetail page", () => {
  it("shows fallback for invalid id", async () => {
    render(
      <MemoryRouter initialEntries={["/song/not-a-number"]}>
        <Routes>
          <Route path="/song/:id" element={<SongDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText("Song not found")).toBeInTheDocument());
  });

  it("renders song details for valid ids", async () => {
    render(
      <MemoryRouter initialEntries={["/song/1"]}>
        <Routes>
          <Route path="/song/:id" element={<SongDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.getByRole("link", { name: "Back to Data Tables" })).toBeInTheDocument()
    );
  });
});
