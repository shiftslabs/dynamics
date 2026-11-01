import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Craftkoru — Personal Services Business OS",
  description: "Specialized business software for fashion designers, tailors, barbers, and beauty artists.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 pb-20 md:pb-6">
        {children}
      </body>
    </html>
  );
}
