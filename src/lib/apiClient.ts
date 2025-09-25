// lib/apiClient.ts
import { auth } from "./firebaseClient";
import toast from "react-hot-toast";

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005";
  }

  private async getAuthToken(): Promise<string | undefined> {
    let user = auth.currentUser;

    if (!user) {
      user = await new Promise((resolve, reject) => {
        const unsubscribe = auth.onAuthStateChanged((u) => {
          unsubscribe();
          if (!u) reject(new Error("No authenticated user"));
          else resolve(u);
        });
      });
    }

    return await user?.getIdToken();
  }

  private async request(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> {
    try {
      const token = await this.getAuthToken();
      const url = `${this.baseUrl}${endpoint}`;

      console.log("Token:", token); // Debugging line

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
        if (response.status === 401) {
          // Token might be expired, try to refresh
          await auth.currentUser?.getIdToken(true);
          return this.request(endpoint, options);
        }

        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      return response.json();
    } catch (error) {
      console.error("API Request failed:", error);
      throw error;
    }
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

  async uploadFile(
    endpoint: string,
    file: File,
    onProgress?: (progress: number) => void
  ) {
    const token = await this.getAuthToken();
    const formData = new FormData();
    formData.append("file", file);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Track upload progress - FIXED: Proper progress calculation
      if (onProgress) {
        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            onProgress(progress);
            console.log(`Upload progress: ${progress}%`); // Debug log
          }
        });

        // Also track load events for completion
        xhr.upload.addEventListener("load", () => {
          onProgress(100);
        });
      }

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (error) {
            resolve(xhr.responseText);
          }
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener("error", () => {
        reject(new Error("Upload failed"));
      });

      xhr.open("POST", `${this.baseUrl}${endpoint}`);
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      xhr.send(formData);
    });
  }
}

export const apiClient = new ApiClient();
