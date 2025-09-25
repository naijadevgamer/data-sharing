import "@testing-library/jest-dom";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
  usePathname: () => "",
}));

// Mock Firebase
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  setPersistence: jest.fn().mockResolvedValue(undefined),
  browserLocalPersistence: {},
  onAuthStateChanged: jest.fn((auth, callback) => {
    if (typeof callback === "function") {
      callback(null); // simulate no user
    }
    return () => {}; // unsubscribe
  }),
}));

// Mock environment variables
process.env.NEXT_PUBLIC_API_URL = "http://localhost:3005";
