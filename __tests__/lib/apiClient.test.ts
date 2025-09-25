// __tests__/lib/apiClient.test.ts
import { apiClient } from "@/lib/apiClient";
import { auth } from "@/lib/firebaseClient";

jest.mock("@/lib/firebaseClient", () => ({
  auth: {
    currentUser: {
      getIdToken: jest.fn().mockResolvedValue("mock-token"),
    },
    onAuthStateChanged: jest.fn(),
  },
}));

// mock global fetch
global.fetch = jest.fn();

describe("ApiClient", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should make a GET request and return data", async () => {
    const mockResponse = { success: true };
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await apiClient.get("/test");

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/test"),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer mock-token",
        }),
      })
    );
    expect(result).toEqual(mockResponse);
  });

  it("should throw an error on failed request", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ message: "Internal error" }),
    });

    await expect(apiClient.get("/fail")).rejects.toThrow("Internal error");
  });
});
