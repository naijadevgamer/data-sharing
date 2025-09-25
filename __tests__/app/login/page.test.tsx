import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "@/app/login/page";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

jest.mock("@/context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("LoginPage", () => {
  const mockLogin = jest.fn();
  const push = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      user: null,
    });
    (useRouter as jest.Mock).mockReturnValue({ push });
  });

  it("renders email and password fields", () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/password/i, { selector: "input" })
    ).toBeInTheDocument();
  });

  it("shows error for invalid email", async () => {
    render(<LoginPage />);
    fireEvent.input(screen.getByLabelText(/email address/i), {
      target: { value: "invalid" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /sign in/i }));

    expect(
      await screen.findByText(/invalid email address/i)
    ).toBeInTheDocument();
  });

  it("calls login on valid submit", async () => {
    render(<LoginPage />);
    fireEvent.input(screen.getByLabelText(/email address/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.input(screen.getByLabelText(/password/i, { selector: "input" }), {
      target: { value: "password123" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("test@example.com", "password123");
    });
  });
});
