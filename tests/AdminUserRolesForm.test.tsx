
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AdminUserRolesForm } from "@/components/dashboard/admin/AdminUserRolesForm";

// Mock the hooks and services that the component depends on
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

vi.mock("@/hooks/useUserRoles", () => ({
  addUserRole: vi.fn(),
  removeUserRole: vi.fn(),
  getUserRoles: vi.fn()
}));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        ilike: vi.fn(() => Promise.resolve({ data: [], error: null }))
      }))
    }))
  }
}));

describe("AdminUserRolesForm", () => {
  it("renders the email input", () => {
    render(<AdminUserRolesForm />);
    const input = screen.getByPlaceholderText(/enter user email address/i);
    expect(input).toBeInTheDocument();
  });

  it("renders the search button", () => {
    render(<AdminUserRolesForm />);
    const button = screen.getByText(/search/i);
    expect(button).toBeInTheDocument();
  });

  it("renders the user role management title", () => {
    render(<AdminUserRolesForm />);
    const title = screen.getByText(/user role management/i);
    expect(title).toBeInTheDocument();
  });
});
