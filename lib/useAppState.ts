"use client";

import { useEffect, useState } from "react";
import { getCurrentUser, loadState } from "./store";
import type { AppState, User } from "./types";

export function useAppState() {
  const [state, setState] = useState<AppState | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const refresh = () => {
      setState(loadState());
      setUser(getCurrentUser());
    };
    refresh();
    window.addEventListener("aasamedchem-state", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("aasamedchem-state", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return { state, user };
}
