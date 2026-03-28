
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "@/pages/Login";

// Mock the AuthContext
vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    user: null,
    profile: null,
    session: null,
    isLoading: false,
    signIn: vi.fn().mockResolvedValue({
      success: false,
      error: "Invalid credentials"
    }),
    signUp: vi.fn(),
    signOut: vi.fn(),
    updateProfile: vi.fn()
  })
}));

// Mock useToast
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: {
      error: vi.fn()
    }
  })
}));

// Mock components to avoid rendering issues
vi.mock("@/components/Navbar", () => ({
  Navbar: () => <div>Navbar</div>
}));

vi.mock("@/components/Footer", () => ({
  Footer: () => <div>Footer</div>
}));

describe("Login form", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders login form elements", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in as traveler/i })).toBeInTheDocument();
  });

  it("allows switching between traveler and hotel partner tabs", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const hotelTab = screen.getByRole("tab", { name: /hotel partner/i });
    fireEvent.click(hotelTab);

    expect(screen.getByPlaceholderText(/enter your business email/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in as hotel partner/i })).toBeInTheDocument();
  });
});
