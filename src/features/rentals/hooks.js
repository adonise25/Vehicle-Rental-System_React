import { useCallback, useState } from "react";
import { messageOf } from "../../shared/http/errors";
import { rentalApi } from "./api";

export function useCreateRental() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [rental, setRental] = useState(null);

  const createRental = useCallback(async (draft) => {
    setSaving(true);
    setError("");
    setRental(null);

    try {
      const result = await rentalApi.create(draft);
      setRental(result);
      return result;
    } catch (err) {
      setError(messageOf(err));
      return null;
    } finally {
      setSaving(false);
    }
  }, []);

  return {
    createRental,
    saving,
    error,
    rental,
  };
}