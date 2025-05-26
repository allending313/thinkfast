import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Grid from "../games/Grid";

describe("Grid", () => {
  it("should render correct number of grid items", () => {
    const rows = 3;
    const cols = 3;
    const totalItems = rows * cols;

    render(
      <Grid rows={rows} cols={cols}>
        {(row, col) => (
          <div key={`${row}-${col}`} data-testid={`cell-${row}-${col}`}>
            Cell {row},{col}
          </div>
        )}
      </Grid>
    );

    // Should render 9 cells for a 3x3 grid
    const cells = screen.getAllByTestId(/^cell-/);
    expect(cells).toHaveLength(totalItems);
  });

  it("should pass correct row and column indices to children function", () => {
    render(
      <Grid rows={2} cols={2}>
        {(row, col) => (
          <div key={`${row}-${col}`} data-testid={`cell-${row}-${col}`}>
            Cell {row},{col}
          </div>
        )}
      </Grid>
    );

    // Check that all expected combinations exist
    expect(screen.getByTestId("cell-0-0")).toBeDefined();
    expect(screen.getByTestId("cell-0-1")).toBeDefined();
    expect(screen.getByTestId("cell-1-0")).toBeDefined();
    expect(screen.getByTestId("cell-1-1")).toBeDefined();
  });

  it("should apply custom className", () => {
    const { container } = render(
      <Grid rows={2} cols={2} className="custom-grid-class">
        {(row, col) => <div key={`${row}-${col}`}>Cell</div>}
      </Grid>
    );

    const gridElement = container.firstChild;
    expect(gridElement).toHaveClass("custom-grid-class");
    expect(gridElement).toHaveClass("grid");
  });

  it("should set correct CSS grid properties", () => {
    const { container } = render(
      <Grid rows={3} cols={4} gap={8}>
        {(row, col) => <div key={`${row}-${col}`}>Cell</div>}
      </Grid>
    );

    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement.style.gridTemplateColumns).toBe(
      "repeat(4, minmax(0, 1fr))"
    );
    expect(gridElement.style.gridTemplateRows).toBe(
      "repeat(3, minmax(0, 1fr))"
    );
    expect(gridElement.style.gap).toBe("8px");
  });

  it("should use default gap value when not provided", () => {
    const { container } = render(
      <Grid rows={2} cols={2}>
        {(row, col) => <div key={`${row}-${col}`}>Cell</div>}
      </Grid>
    );

    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement.style.gap).toBe("4px"); // Default gap value
  });

  it("should handle single cell grid", () => {
    render(
      <Grid rows={1} cols={1}>
        {(row, col) => (
          <div key={`${row}-${col}`} data-testid="single-cell">
            Single Cell
          </div>
        )}
      </Grid>
    );

    expect(screen.getByTestId("single-cell")).toBeDefined();
    expect(screen.getByText("Single Cell")).toBeDefined();
  });

  it("should handle rectangular grids", () => {
    render(
      <Grid rows={2} cols={5}>
        {(row, col) => (
          <div key={`${row}-${col}`} data-testid={`cell-${row}-${col}`}>
            Cell
          </div>
        )}
      </Grid>
    );

    // Should have 10 cells total (2 rows × 5 cols)
    const cells = screen.getAllByTestId(/^cell-/);
    expect(cells).toHaveLength(10);

    // Check specific positions exist
    expect(screen.getByTestId("cell-0-4")).toBeDefined(); // Last cell in first row
    expect(screen.getByTestId("cell-1-4")).toBeDefined(); // Last cell in second row
  });
});
