import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000").replace(/\/$/, "");

  const robots = `# Robots policy
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api
Disallow: /cart
Disallow: /checkout
Disallow: /checkout_oldapr15
Disallow: /orders
Disallow: /order
Disallow: /profile
Disallow: /address
Disallow: /track-orders
Disallow: /thank-you
Disallow: /search

# Google adsbot ignores robots.txt unless specifically named
User-agent: adsbot-google
Disallow: /cart
Disallow: /checkout
Disallow: /checkout_oldapr15
Disallow: /orders
Disallow: /order
Disallow: /thank-you

User-agent: Nutch
Disallow: /

User-agent: AhrefsBot
Crawl-delay: 10
Disallow: /admin
Disallow: /api
Disallow: /cart
Disallow: /checkout
Disallow: /checkout_oldapr15
Disallow: /orders
Disallow: /order
Disallow: /profile
Disallow: /address
Disallow: /track-orders
Disallow: /thank-you
Disallow: /search

User-agent: AhrefsSiteAudit
Crawl-delay: 10
Disallow: /admin
Disallow: /api
Disallow: /cart
Disallow: /checkout
Disallow: /checkout_oldapr15
Disallow: /orders
Disallow: /order
Disallow: /profile
Disallow: /address
Disallow: /track-orders
Disallow: /thank-you
Disallow: /search

User-agent: MJ12bot
Crawl-delay: 10

User-agent: Pinterest
Crawl-delay: 1

Sitemap: ${baseUrl}/sitemap.xml
`;

  return new NextResponse(robots, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
