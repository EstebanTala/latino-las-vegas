import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Latino Las Vegas — Guía en Español de Las Vegas",
  description:
    "La guía más completa de Las Vegas en español. Hoteles, restaurantes, shows, vida nocturna y atracciones para la comunidad latina.",
  metadataBase: new URL("https://latinolasvegas.com"),
  openGraph: {
    type: "website",
    url: "https://latinolasvegas.com",
    title: "Latino Las Vegas — Guía en Español de Las Vegas",
    description:
      "La guía más completa de Las Vegas en español. Hoteles, restaurantes, shows, vida nocturna y atracciones para la comunidad latina.",
    siteName: "Latino Las Vegas",
    locale: "es_MX",
  },
  twitter: {
    card: "summary_large_image",
    title: "Latino Las Vegas — Guía en Español de Las Vegas",
    description:
      "La guía más completa de Las Vegas en español. Hoteles, restaurantes, shows, vida nocturna y atracciones para la comunidad latina.",
  },
  alternates: {
    canonical: "https://latinolasvegas.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <meta name="google-site-verification" content="D7XWN108oaKK0y8nxsnrUKyILmrgR6gAngLnOxt2qGQ" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
