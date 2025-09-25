import { render, screen, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import toast from "react-hot-toast";

// ✅ Mock firebaseClient so getAuth(app) never runs
jest.mock("@/lib/firebaseClient", () => ({
  auth: {},
}));

// ✅ Mock Firebase auth functions
jest.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(() => jest.fn()), // unsubscribe mock
}));

jest.mock("react-hot-toast", () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

// Helper test component to access context
const TestComponent = () => {
  const { login, logout, userRole } = useAuth();
  return (
    <div>
      <button onClick={() => login("usera@example.com", "password")}>
        Login A
      </button>
      <button onClick={() => logout()}>Logout</button>
      <span data-testid="role">{userRole}</span>
    </div>
  );
};

describe("AuthProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders children", () => {
    render(
      <AuthProvider>
        <div data-testid="child">Hello</div>
      </AuthProvider>
    );
    expect(screen.getByTestId("child")).toHaveTextContent("Hello");
  });

  it("login sets userRole to userA", async () => {
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
      user: { getIdToken: jest.fn().mockResolvedValue("token") },
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText("Login A").click();
    });

    expect(screen.getByTestId("role")).toHaveTextContent("userA");
    expect(toast.success).toHaveBeenCalledWith("Welcome back!");
  });

  it("logout clears userRole", async () => {
    (signOut as jest.Mock).mockResolvedValueOnce(undefined);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText("Logout").click();
    });

    expect(screen.getByTestId("role")).toHaveTextContent("");
    expect(toast.success).toHaveBeenCalledWith("Logged out successfully");
  });
});
