"use client";

import { useEffect } from "react";
import { apiClient } from "@/lib/apiClient";

export default function Home() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiClient.get("/protected");
        console.log(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return <div>Hello world</div>;
}
