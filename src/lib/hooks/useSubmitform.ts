"use client";
import { useState } from "react";

export function useFormSubmit() {
  const [isLoading, setIsLoading] = useState(false);

  const submitWrapper = async (fn: () => Promise<void>) => {
    setIsLoading(true);
    try {
      await fn();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, submitWrapper };
}
