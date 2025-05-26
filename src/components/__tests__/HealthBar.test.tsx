import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import HealthBar from "../games/HealthBar";

describe("HealthBar", () => {
  it("should render correct number of hearts", () => {
    render(<HealthBar maxHealth={5} health={3} />);

    // Should render 5 hearts total (3 filled + 2 empty)
    const hearts = screen.getAllByText(/❤️|🤍/);
    expect(hearts).toHaveLength(5);
  });

  it("should render filled hearts for current health", () => {
    render(<HealthBar maxHealth={5} health={3} />);

    const filledHearts = screen.getAllByText("❤️");
    expect(filledHearts).toHaveLength(3);
  });

  it("should render empty hearts for lost health", () => {
    render(<HealthBar maxHealth={5} health={3} />);

    const emptyHearts = screen.getAllByText("🤍");
    expect(emptyHearts).toHaveLength(2);
  });

  it("should render all filled hearts when health equals maxHealth", () => {
    render(<HealthBar maxHealth={3} health={3} />);

    const filledHearts = screen.getAllByText("❤️");
    const emptyHearts = screen.queryAllByText("🤍");

    expect(filledHearts).toHaveLength(3);
    expect(emptyHearts).toHaveLength(0);
  });

  it("should render all empty hearts when health is 0", () => {
    render(<HealthBar maxHealth={3} health={0} />);

    const filledHearts = screen.queryAllByText("❤️");
    const emptyHearts = screen.getAllByText("🤍");

    expect(filledHearts).toHaveLength(0);
    expect(emptyHearts).toHaveLength(3);
  });

  it("should handle edge case with single heart", () => {
    render(<HealthBar maxHealth={1} health={1} />);

    const filledHearts = screen.getAllByText("❤️");
    expect(filledHearts).toHaveLength(1);
  });
});
