export const TOKEN_COOKIE = "token";

export function getTokenFromCookieOnServer(cookieHeader: string | null | undefined) {
  if (!cookieHeader) return null;
  const cookies = Object.fromEntries(cookieHeader.split("; ").map(c => {
    const [k, ...rest] = c.split("=");
    return [k, rest.join("=")];
  }));
  return cookies[TOKEN_COOKIE] || null;
}

