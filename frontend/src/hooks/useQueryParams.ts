import { useSearchParams } from "react-router-dom";

export function useQueryParams<T extends Record<string, string>>() {
  const [searchParams, setSearchParams] = useSearchParams();

  const params = Object.fromEntries(searchParams.entries()) as T;

  function setParams(next: Partial<T>) {
    const updated = new URLSearchParams(searchParams);

    Object.entries(next).forEach(([key, value]) => {
      if (!value) {
        updated.delete(key);
      } else {
        updated.set(key, value);
      }
    });

    setSearchParams(updated);
  }

  return { params, setParams };
}
