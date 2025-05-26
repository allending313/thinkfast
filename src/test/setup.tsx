import { vi } from "vitest";
import "@testing-library/jest-dom";

// Mock motion/react for tests
vi.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    button: ({ children, ...props }: any) => (
      <button {...props}>{children}</button>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useAnimate: () => [{ current: null }, vi.fn()],
  useAnimation: () => ({
    start: vi.fn(),
  }),
}));

// Mock react-router
vi.mock("react-router", () => ({
  Link: ({ children, to, ...props }: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: "/" }),
}));

// Setup localStorage mock
Object.defineProperty(window, "localStorage", {
  value: {
    getItem: vi.fn(() => null),
    setItem: vi.fn(() => null),
    removeItem: vi.fn(() => null),
    clear: vi.fn(() => null),
  },
  writable: true,
});

// Mock performance.now for reaction test
Object.defineProperty(window, "performance", {
  value: {
    now: vi.fn(() => Date.now()),
  },
  writable: true,
});