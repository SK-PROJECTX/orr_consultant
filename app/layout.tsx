import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Script from 'next/script';
import TrailingSlashRedirect from "@/components/TrailingSlashRedirect";

export const metadata: Metadata = {
  title: "ORR Solutions | Consultant Portal",
  description: "Secure, premium collaboration workspace for ORR Solutions technical consultants.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-screen bg-background text-foreground antialiased flex flex-col selection:bg-primary selection:text-background">
        <TrailingSlashRedirect />
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
      </body>
    </html>
  );
}
