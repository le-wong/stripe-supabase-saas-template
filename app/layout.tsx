import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { createClient } from "@/utils/supabase/server"
import { AuthProvider } from "@/components/auth/AuthProvider";

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
  const supabase = await createClient();
  const { data } = await supabase.auth.getSession();
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider initialSession={data.session ?? null}>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
