import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AI Browser Agent",
  description: "Dashboard for AI Browser Agent",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="h-screen w-screen overflow-hidden bg-zinc-950 text-zinc-50 antialiased flex flex-col">
        {children}
      </body>
    </html>
  );
}
