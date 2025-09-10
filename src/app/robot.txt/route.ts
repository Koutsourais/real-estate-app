export async function GET() {
  const isUC = process.env.UNDER_CONSTRUCTION === "true";
  const body = isUC
    ? "User-agent: *\nDisallow: /"
    : "User-agent: *\nAllow: /";
  return new Response(body, {
    headers: { "Content-Type": "text/plain" },
  });
}
