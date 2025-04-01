export const getTokenFromCookies = (req: Request) => {
  const cookieHeader = req.headers.get("cookie");

  if (!cookieHeader) return null;

  console.log("Cookie Header:", cookieHeader);

  const cookies = cookieHeader
    .split("; ")
    .map((cookie) => cookie.split("="))
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

  console.log("Parsed Cookies:", cookies);

  return cookies.token || null;
};
