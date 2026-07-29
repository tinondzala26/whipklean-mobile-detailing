import type { Metadata } from "next";
import "./globals.css";

const title = "WhipKlean | Mobile Vehicle Detailing & Protection";
const description =
  "Canadian mobile vehicle detailing at your home, workplace, or fleet location. Deep cleaning, careful washing, and corrosion-conscious protection.";

export const metadata: Metadata = {
  metadataBase: new URL("https://whipklean.tinotendadzawi.com"),
  title,
  description,
  icons: {
    icon: "/images/whipklean-logo.png",
    shortcut: "/images/whipklean-logo.png",
  },
  openGraph: {
    title,
    description,
    type: "website",
    url: "/",
    images: [{ url: "/og.png", width: 1733, height: 907, alt: "WhipKlean Canadian mobile vehicle detailing" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
