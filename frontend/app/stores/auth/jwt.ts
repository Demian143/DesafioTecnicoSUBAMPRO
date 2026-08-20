import type { JwtPayload } from "./types";

export function decodeJwtPayload(token: string): JwtPayload {
  const segment = token.split(".")[1];
  if (!segment) throw new Error("Invalid JWT");

  const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
  const bytes = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
  const json = decodeURIComponent(
    Array.from(bytes)
      .map((character) => `%${character.charCodeAt(0).toString(16).padStart(2, "0")}`)
      .join(""),
  );
  const payload = JSON.parse(json) as Partial<JwtPayload>;

  if (payload.sub === undefined || !payload.iat || !payload.exp) {
    throw new Error("Invalid JWT payload");
  }

  return payload as JwtPayload;
}

export function isJwtExpired(payload: JwtPayload | null): boolean {
  return !payload || payload.exp <= Math.floor(Date.now() / 1000);
}
