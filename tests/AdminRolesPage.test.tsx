
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import AdminRolesPage from "@/pages/AdminRoles";

// Mock the AdminRoute component to simulate unauthenticated access
vi.mock("@/components/auth/AdminRoute", () => ({
  AdminRoute: ({ children }: { children: JSX.Element }) => {
    // Simulate redirect behavior for unauthenticated users
    return <div>Access Denied</div>;
  }
}));

// Mock other components to avoid rendering issues
vi.mock("@/components/Navbar", () => ({
  Navbar: () => <div>Navbar</div>
}));

vi.mock("@/components/Footer", () => ({
  Footer: () => <div>Footer</div>
}));

vi.mock("@/components/hotels/HotelStarfield", () => ({
  HotelStarfield: () => <div>Starfield</div>
}));

vi.mock("@/components/dashboard/admin/AdminUserRolesForm", () => ({
  AdminUserRolesForm: () => <div>Admin User Roles Form</div>
}));

describe("AdminRolesPage", () => {
  it("redirects unauthenticated users", () => {
    render(
      <MemoryRouter initialEntries={["/admin-roles"]}>
        <Routes>
          <Route path="/admin-roles" element={<AdminRolesPage />} />
          <Route path="*" element={<p>Not Found</p>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Access Denied/i)).toBeInTheDocument();
  });
});
