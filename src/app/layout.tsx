import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./global.css";
import HeaderClient from "@/components/client/header";
import FooterClient from "@/components/client/footer";
import { GoogleOAuthProvider } from '@react-oauth/google';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Travely",
  description: "Booking your tour easily and conveniently",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleOAuthProvider clientId={googleClientId}>
          <HeaderClient />
          {children}
          <FooterClient />
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
