import { NextResponse } from "next/server";

const PRIVATE_PATHS = [
  "/admin",
  "/api",
  "/cart",
  "/checkout",
  "/checkout_oldapr15",
  "/orders",
  "/order",
  "/profile",
  "/address",
  "/track-orders",
  "/thank-you",
  "/search",
];

function disallowLines() {
  return PRIVATE_PATHS.map((path) => `Disallow: ${path}`).join("\n");
}

function googleBotBlock(agent) {
  return `User-agent: ${agent}
Allow: /
${disallowLines()}`;
}

export async function GET() {
  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000").replace(
    /\/$/,
    ""
  );

  const robots = `# Block all crawlers by default (reduces non-Google bot traffic)
User-agent: *
Disallow: /

# Allow Google Search crawlers only
${googleBotBlock("Googlebot")}

${googleBotBlock("Googlebot-Image")}

Sitemap: ${baseUrl}/sitemap.xml
`;

  return new NextResponse(robots, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
