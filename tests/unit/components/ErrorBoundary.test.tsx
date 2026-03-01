import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ErrorBoundary from "../../../src/components/ErrorBoundary";

// Component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error("Test error");
  }
  return <div>No error</div>;
};

describe("ErrorBoundary", () => {
  // Suppress console.error for cleaner test output
  const originalError = console.error;
  beforeAll(() => {
    console.error = vi.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  it("should render children when no error", () => {
    render(
      <ErrorBoundary>
        <div>Test Child Component</div>
      </ErrorBoundary>
    );

    expect(screen.getByText("Test Child Component")).toBeInTheDocument();
  });

  it("should catch errors and display fallback UI", () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Oops! Something went wrong/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /refresh page/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
  });

  it("should render custom fallback when provided", () => {
    const customFallback = <div>Custom Error Message</div>;

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText("Custom Error Message")).toBeInTheDocument();
    expect(screen.queryByText(/Oops! Something went wrong/i)).not.toBeInTheDocument();
  });

  it("should have refresh button that reloads page", async () => {
    const user = userEvent.setup();

    // Mock window.location.reload
    const reloadMock = vi.fn();
    Object.defineProperty(window, "location", {
      value: { reload: reloadMock },
      writable: true,
    });

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const refreshButton = screen.getByRole("button", { name: /refresh page/i });
    await user.click(refreshButton);

    expect(reloadMock).toHaveBeenCalled();
  });

  it("should not display error details in production", () => {
    // Set production environment
    const originalEnv = import.meta.env.DEV;
    import.meta.env.DEV = false;

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.queryByText(/Error Details/i)).not.toBeInTheDocument();

    // Restore
    import.meta.env.DEV = originalEnv;
  });
});
