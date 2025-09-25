import { render, screen } from "@testing-library/react";
import DashboardPage from "@/app/dashboard/page";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

jest.mock("@/context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("DashboardPage", () => {
  const replace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ replace });
  });

  it("renders loader text", () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null, userRole: null });
    render(<DashboardPage />);
    expect(
      screen.getByText(/redirecting to your dashboard/i)
    ).toBeInTheDocument();
  });

  it("redirects userA to /dashboard/userA", () => {
    (useAuth as jest.Mock).mockReturnValue({ user: {}, userRole: "userA" });
    render(<DashboardPage />);
    expect(replace).toHaveBeenCalledWith("/dashboard/userA");
  });

  it("redirects userB to /dashboard/userB", () => {
    (useAuth as jest.Mock).mockReturnValue({ user: {}, userRole: "userB" });
    render(<DashboardPage />);
    expect(replace).toHaveBeenCalledWith("/dashboard/userB");
  });

  it("redirects unknown role to /login", () => {
    (useAuth as jest.Mock).mockReturnValue({ user: {}, userRole: null });
    render(<DashboardPage />);
    expect(replace).toHaveBeenCalledWith("/login");
  });
});
