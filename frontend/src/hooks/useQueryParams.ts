import { useSearchParams } from "react-router-dom";

export function useQueryParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const get = (key: string) => searchParams.get(key) || "";

  const set = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  return { get, set };
}
