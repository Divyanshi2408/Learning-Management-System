// src/hooks/useNetworkStatus.js
import { useSyncExternalStore } from "react";
import { getSnapshot, subscribe } from "../utils/networkStore";

export default function useNetworkStatus() {
  return useSyncExternalStore(subscribe, getSnapshot);
}
