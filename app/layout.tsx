import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutFrame from "@/src/components/LayoutFrame";

const inter = Inter({
  variable: "--font-app-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ExhibitPro",
  description: "Customer dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
          integrity="sha512-p7R7b8s2h3G+QO9bJgCwJw9B1Jc7S8Jx8zQ3m8cCzJmT0bqgI3cTg0FzvX1M2m8y5b1m4y7m1uZlWbQ8bQ1Ng=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className={`${inter.variable} antialiased font-sans`}>
        <LayoutFrame>
          {children}
        </LayoutFrame>
      </body>
    </html>
  );
}
