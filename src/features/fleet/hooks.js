// Application layer: one hook per use case. Pages stay thin and call these.
// Reads (useVehicles) are kept apart from commands (rent, add).
import { useCallback, useEffect, useRef, useState } from "react";
import { messageOf } from "../../shared/http/errors";
import { fleetApi } from "./api";

// Query: load the vehicle list.
export function useVehicles() {
  const [state, setState] = useState({
    status: "loading",
    vehicles: [],
    error: "",
  });

  const alive = useRef(true);

  const load = useCallback(async ({ silent = false } = {}) => {
    if (!silent) {
      setState((current) => ({
        ...current,
        status: "loading",
        error: "",
      }));
    }

    try {
      const vehicles = await fleetApi.list();

      if (alive.current) {
        setState({
          status: "ready",
          vehicles,
          error: "",
        });
      }
    } catch (err) {
      if (alive.current) {
        setState((current) => ({
          status: silent ? current.status : "error",
          vehicles: current.vehicles,
          error: messageOf(err),
        }));
      }
    }
  }, []);

  useEffect(() => {
    alive.current = true;

    load();

    return () => {
      alive.current = false;
    };
  }, [load]);

  return {
    ...state,
    reload: load,
  };
}

// Command: add a vehicle.
export function useAddVehicle() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const add = useCallback(async (draft) => {
    setSaving(true);
    setError("");

    try {
      await fleetApi.add(draft);
      return true;
    } catch (err) {
      setError(messageOf(err));
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  return {
    add,
    saving,
    error,
  };
}