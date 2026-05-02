import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Super Cool Storefront",
  description: "Buy my stuff - you won't regret it!",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main>
          {children}
        </main>
        <div className="py-4 px-2 bg-gray-700 text-white text-center w-full sticky bottom-0">Remember to add a footer...</div>
      </body>

    </html>
  );
}
