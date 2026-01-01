import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tailwindify - CSS to Tailwind Converter",
  description: "Convert your CSS styles to Tailwind CSS utility classes instantly. A free, client-side tool for developers.",
  keywords: ["CSS", "Tailwind CSS", "converter", "utility classes", "web development", "frontend"],
  authors: [{ name: "Tailwindify" }],
  openGraph: {
    title: "Tailwindify - CSS to Tailwind Converter",
    description: "Convert your CSS styles to Tailwind CSS utility classes instantly.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
