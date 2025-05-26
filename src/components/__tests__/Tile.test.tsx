import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Tile from "../games/Tile";

describe("Tile", () => {
  it("should render hidden tile with gray background", () => {
    const mockOnClick = vi.fn();
    render(<Tile id="test-tile" state="hidden" onClick={mockOnClick} />);

    const tile = screen.getByTestId("innerTile");
    expect(tile).toBeDefined();
    expect(tile).toHaveClass("bg-gray-200")
  });

  it("should render shown tile with blue background by default", () => {
    const mockOnClick = vi.fn();
    render(<Tile id="test-tile" state="shown" onClick={mockOnClick} />
);

    const tile = screen.getByTestId("innerTile");
    expect(tile).toBeDefined();
    expect(tile).toHaveClass("bg-blue-300");
  });

  it("should render valid shown tile with indigo background", () => {
    const mockOnClick = vi.fn();
    render(
      <Tile id="test-tile" state="shown" isValid={true} onClick={mockOnClick} />
    );

    const tile = screen.getByTestId("innerTile");
    expect(tile).toBeDefined();
    expect(tile).toHaveClass("bg-indigo-500");
  });

  it("should render invalid shown tile with red background", () => {
    const mockOnClick = vi.fn();
    render(
      <Tile
        id="test-tile"
        state="shown"
        isValid={false}
        onClick={mockOnClick}
      />
    );

    const tile = screen.getByTestId("innerTile");
    expect(tile).toBeDefined();
    expect(tile).toHaveClass("bg-red-300");
  });

  it("should call onClick when clicked and not disabled", () => {
    const mockOnClick = vi.fn();
    render(<Tile id="test-tile" state="hidden" onClick={mockOnClick} />);

    const tile = screen.getByTestId("innerTile");
    fireEvent.click(tile);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("should not call onClick when disabled", () => {
    const mockOnClick = vi.fn();
    render(
      <Tile
        id="test-tile"
        state="hidden"
        disabled={true}
        onClick={mockOnClick}
      />
    );

    const tile = screen.getByTestId("innerTile").parentElement;
    expect(tile).toHaveClass("pointer-events-none");

    // Try to click the disabled tile
    fireEvent.click(tile as Element);
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it("should have proper CSS classes for styling", () => {
    const mockOnClick = vi.fn();
    const { container } = render(
      <Tile id="test-tile" state="hidden" onClick={mockOnClick} />
    );

    const tile = container.firstChild;
    expect(tile).toHaveClass("aspect-square");
    expect(tile).toHaveClass("rounded-lg");
    expect(tile).toHaveClass("cursor-pointer");
    expect(tile).toHaveClass("shadow-md");
  });
});
