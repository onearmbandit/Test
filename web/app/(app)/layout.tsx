import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import dynamic from "next/dynamic";
import Provider from "@/components/provider/query-provider";
import { Toaster } from "sonner";

const AuthProvider = dynamic(() => import("../../components/AuthProvider"), {
  ssr: false,
});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "C3 Insets",
  description: "Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className + " flex"}>
        <AuthProvider>
          <Provider>{children}</Provider>
        </AuthProvider>
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
