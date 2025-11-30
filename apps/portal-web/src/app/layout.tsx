import type { Metadata } from "next";
import "./globals.css";
import { NavbarWrapper } from "@/components/layout/NavbarWrapper";
import { ServiceWorkerRegistration } from "@/components/pwa/ServiceWorkerRegistration";
import { AudioContextProvider } from "@/lib/fracture/audio/AudioContextProvider";
import { AbyssIDProvider } from "@/lib/fracture/identity/AbyssIDContext";
import { UnifrakturMaguntia, Creepster } from "next/font/google";

const unifraktur = UnifrakturMaguntia({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-unifraktur",
  display: "swap",
});

const creepster = Creepster({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-creepster",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Demiurge — Sovereign Digital Pantheon",
  description: "A sovereign L1 and creator economy for Archons and Nomads.",
  manifest: "/manifest.json",
  themeColor: "#020617",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Demiurge",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${unifraktur.variable} ${creepster.variable}`}>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="gradient-orbit min-h-screen antialiased">
        <ServiceWorkerRegistration />
        <AbyssIDProvider>
          <AudioContextProvider>
            <NavbarWrapper>
              {children}
            </NavbarWrapper>
          </AudioContextProvider>
        </AbyssIDProvider>
      </body>
    </html>
  );
}
