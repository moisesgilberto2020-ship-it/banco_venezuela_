import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const iconPath = "/favicon.svg";
const absoluteIconUrl = siteUrl.endsWith("/")
  ? `${siteUrl.slice(0, -1)}${iconPath}`
  : `${siteUrl}${iconPath}`;

export const metadata: Metadata = {
  title: "Banco de Venezuela",
  description: "BDVenlínea personas",
  metadataBase: new URL(siteUrl),
  icons: {
    icon: [
      {
        url: absoluteIconUrl,
        type: "image/svg+xml",
      },
    ],
  },
  openGraph: {
    title: "Banco de Venezuela",
    description: "BDVenlínea personas",
    url: siteUrl,
    siteName: "Banco de Venezuela",
    images: [
      {
        url: absoluteIconUrl,
        width: 512,
        height: 512,
        alt: "Banco de Venezuela",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Banco de Venezuela",
    description: "BDVenlínea personas",
    images: [absoluteIconUrl],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
