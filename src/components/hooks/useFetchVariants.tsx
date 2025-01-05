// hooks/useFetchVariants.ts
import { useState, useEffect } from "react";
import axios from "axios";
import { Variant } from "../types";

export const useFetchVariants = (url: string) => {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVariants = async () => {
      try {
        const response = await axios.get<Variant[]>(url);
        setVariants(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load variants.");
      } finally {
        setLoading(false);
      }
    };

    fetchVariants();
  }, [url]);

  return { variants, loading, error };
};
