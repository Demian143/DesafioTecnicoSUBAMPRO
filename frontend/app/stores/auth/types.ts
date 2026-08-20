export type JwtPayload = {
  sub: number | string;
  iat: number;
  exp: number;
};

export type AuthState = {
  token: string | null;
  payload: JwtPayload | null;
  setToken: (token: string) => void;
  clearToken: () => void;
};
