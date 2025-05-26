import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useReactionTest } from "../useReactionTest";

// Mock the useScores hook
vi.mock("../useScores", () => ({
  useScores: () => ({
    addScore: vi.fn(),
  }),
}));

describe("useReactionTest", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    // Mock performance.now to return consistent values
    vi.spyOn(performance, "now")
      .mockReturnValueOnce(1000) // Start time
      .mockReturnValueOnce(1250); // End time (250ms reaction time)
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("should initialize with ready state", () => {
    const { result } = renderHook(() => useReactionTest());

    expect(result.current.gameState).toBe("ready");
    expect(result.current.reactionTime).toBeNull();
  });

  it("should start game and transition to waiting state", () => {
    const { result } = renderHook(() => useReactionTest());

    act(() => {
      result.current.handleGameClick(); // Click to start
    });

    expect(result.current.gameState).toBe("waiting");
  });

  it("should handle early click during waiting state", () => {
    const { result } = renderHook(() => useReactionTest());

    // Start the game
    act(() => {
      result.current.handleGameClick();
    });

    expect(result.current.gameState).toBe("waiting");

    // Click too early
    act(() => {
      result.current.handleGameClick();
    });

    expect(result.current.gameState).toBe("tooEarly");
  });

  it("should transition to clickNow state after random delay", () => {
    const { result } = renderHook(() => useReactionTest());

    // Start the game
    act(() => {
      result.current.handleGameClick();
    });

    expect(result.current.gameState).toBe("waiting");

    // Fast forward time to trigger the "clickNow" state
    act(() => {
      vi.advanceTimersByTime(5000); // Max delay is 4900ms
    });

    expect(result.current.gameState).toBe("clickNow");
  });

  it("should measure reaction time when clicked during clickNow state", () => {
    const { result } = renderHook(() => useReactionTest());

    // Start the game
    act(() => {
      result.current.handleGameClick();
    });

    // Fast forward to clickNow state
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current.gameState).toBe("clickNow");

    // Click during the correct time
    act(() => {
      result.current.handleGameClick();
    });

    expect(result.current.gameState).toBe("complete");
    expect(result.current.reactionTime).toBe(250); // Based on our mock
  });

  it("should reset to ready state from complete state", () => {
    const { result } = renderHook(() => useReactionTest());

    // Start game and complete it
    act(() => {
      result.current.handleGameClick(); // Start
    });
    act(() => {
      vi.advanceTimersByTime(5000); // Wait
    });
    act(() => {
      result.current.handleGameClick(); // Click
    });

    expect(result.current.gameState).toBe("complete");

    // Click to restart
    act(() => {
      result.current.handleGameClick();
    });

    expect(result.current.gameState).toBe("ready");
  });

  it("should reset to ready state from tooEarly state", () => {
    const { result } = renderHook(() => useReactionTest());

    // Start game and click too early
    act(() => {
      result.current.handleGameClick(); // Start
    });
    act(() => {
      result.current.handleGameClick(); // Too early
    });

    expect(result.current.gameState).toBe("tooEarly");

    // Click to restart
    act(() => {
      result.current.handleGameClick();
    });

    expect(result.current.gameState).toBe("ready");
  });

  it("should reset game using resetGame function", () => {
    const { result } = renderHook(() => useReactionTest());

    // Start game
    act(() => {
      result.current.handleGameClick();
    });

    expect(result.current.gameState).toBe("waiting");

    // Reset game
    act(() => {
      result.current.resetGame();
    });

    expect(result.current.gameState).toBe("ready");
    expect(result.current.reactionTime).toBeNull();
  });
});
