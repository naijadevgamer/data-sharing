import { auth } from "./firebaseClient";

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005";
  }

  // private async getAuthToken(): Promise<string> {
  //   const user = auth.currentUser;
  //   console.log("Current user in apiClient:", user);
  //   if (!user) {
  //     throw new Error("No authenticated user");
  //   }
  //   return await user.getIdToken();
  // }

  private async getAuthToken(): Promise<string | undefined> {
    let user = auth.currentUser;

    if (!user) {
      // Wait for Firebase to restore the user
      user = await new Promise((resolve, reject) => {
        const unsubscribe = auth.onAuthStateChanged((u) => {
          unsubscribe();
          if (!u) reject(new Error("No authenticated user"));
          else resolve(u);
        });
      });
    }
    return await user?.getIdToken();

    // Use the modular function from Firebase v9+
    // return getIdToken(user);
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const token = await this.getAuthToken();
    console.log("Using token:", token);
    const url = `${this.baseUrl}${endpoint}`;
    console.log("Request URL:", url);

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async get(endpoint: string) {
    return this.request(endpoint);
  }

  async post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint: string) {
    return this.request(endpoint, { method: "DELETE" });
  }

  async uploadFile(endpoint: string, file: File) {
    const token = await this.getAuthToken();
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

export const apiClient = new ApiClient();
