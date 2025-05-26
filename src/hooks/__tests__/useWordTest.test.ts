import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useWordMemory } from "../useWordTest";

// Mock the useScores hook
vi.mock("../useScores", () => ({
  useScores: () => ({
    addScore: vi.fn(),
  }),
}));

// Mock the word bank
vi.mock("../../utils/wordBank", () => ({
  WORDS: ["apple", "banana", "cherry", "date", "elderberry"],
}));

describe("useWordMemory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with correct default state", () => {
    const { result } = renderHook(() => useWordMemory());

    expect(result.current.gameState).toBe("ready");
    expect(result.current.currentWord).toBe("");
    expect(result.current.score).toBe(0);
    expect(result.current.health).toBe(3);
    expect(result.current.seen).toBe(false);
  });

  it("should start game and set first word", () => {
    const { result } = renderHook(() => useWordMemory());

    act(() => {
      result.current.startGame();
    });

    expect(result.current.gameState).toBe("playing");
    expect(result.current.currentWord).not.toBe("");
    expect(result.current.score).toBe(0);
    expect(result.current.health).toBe(3);
  });

  it("should increase score on correct answer", () => {
    const { result } = renderHook(() => useWordMemory());

    act(() => {
      result.current.startGame();
    });

    const initialScore = result.current.score;

    act(() => {
      result.current.answerWord(true); // Assume correct answer
    });

    expect(result.current.score).toBe(initialScore + 1);
    expect(result.current.health).toBe(3); // Health should remain the same
  });

  it("should decrease health on incorrect answer", () => {
    const { result } = renderHook(() => useWordMemory());

    act(() => {
      result.current.startGame();
    });

    act(() => {
      result.current.answerWord(false); // Incorrect answer
    });

    expect(result.current.health).toBe(2);
    expect(result.current.gameState).toBe("playing"); // Should still be playing
  });

  it("should end game when health reaches 0", () => {
    const { result } = renderHook(() => useWordMemory());

    act(() => {
      result.current.startGame();
    });

    // Make 3 incorrect answers to exhaust health
    act(() => {
      result.current.answerWord(false);
    });
    act(() => {
      result.current.answerWord(false);
    });
    act(() => {
      result.current.answerWord(false);
    });

    expect(result.current.health).toBe(0);
    expect(result.current.gameState).toBe("game-over");
  });

  it("should reset game state", () => {
    const { result } = renderHook(() => useWordMemory());

    // Start and play game
    act(() => {
      result.current.startGame();
    });
    act(() => {
      result.current.answerWord(true);
    });

    // Reset game
    act(() => {
      result.current.resetGame();
    });

    expect(result.current.gameState).toBe("ready");
    expect(result.current.currentWord).toBe("");
    expect(result.current.score).toBe(0);
    expect(result.current.health).toBe(3);
    expect(result.current.seen).toBe(false);
  });

  it("should restart game from game over state", () => {
    const { result } = renderHook(() => useWordMemory());

    act(() => {
      result.current.startGame();
    });

    // End the game
    act(() => {
      result.current.answerWord(false);
    });
    act(() => {
      result.current.answerWord(false);
    });
    act(() => {
      result.current.answerWord(false);
    });

    expect(result.current.health).toBe(0);
    expect(result.current.gameState).toBe("game-over");

    // Try again
    act(() => {
      result.current.tryAgain();
    });

    expect(result.current.gameState).toBe("playing");
    expect(result.current.health).toBe(3);
    expect(result.current.score).toBe(0);
  });
});
