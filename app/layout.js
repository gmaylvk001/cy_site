import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/app/ClientLayout";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Cycle World - Bicycle Dealers in India | Cycle shop near me | cycles",
  description: "Cycle World is a leading bicycle dealer in India with 90+ stores. recognized as the best cycle shop in Tamil Nadu, Bangalore, and Hyderabad.",
  icons: {
    icon: "/images/logo/cropped-cw-logo-192x192.webp",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientLayout>{children}</ClientLayout>
        {/* ✅ Tracking Script */}
        <Script id="adtarbo-tracking" strategy="afterInteractive">
          {`(function(dd, ss, idd) {
              var js, ajs = dd.getElementsByTagName(ss)[0];
              if (dd.getElementById(idd)) {return;}
              js = dd.createElement(ss);
              js.id = idd;
              js.aun_id = "DxxR7VDj28N7";
              js.src = "https://pixel.adtarbo.com/pixelTrack1.js";
              ajs.parentNode.insertBefore(js, ajs);
          }(document, 'script', 'adtarbo-js-v2'));`}
        </Script>
         {/*insta_video */}
        <Script async src="https://www.instagram.com/embed.js"></Script>
      </body>
    </html>
  );
}
