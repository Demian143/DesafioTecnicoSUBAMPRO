import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { decodeJwtPayload, isJwtExpired } from "./jwt";
import type { AuthState } from "./types";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      payload: null,

      setToken(token) {
        set({ token, payload: decodeJwtPayload(token) });
      },

      clearToken() {
        set({ token: null, payload: null });
      },
    }),
    {
      name: "projeto-aberto.jwt",
      storage: createJSONStorage(() => localStorage),
      partialize: ({ token, payload }) => ({ token, payload }),
      onRehydrateStorage: () => (state) => {
        if (state && isJwtExpired(state.payload)) state.clearToken();
      },
    },
  ),
);

export { isJwtExpired } from "./jwt";
export type { JwtPayload } from "./types";
