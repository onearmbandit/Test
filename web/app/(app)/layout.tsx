import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import dynamic from "next/dynamic";

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
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className + " flex"}>
        <AuthProvider>{children}</AuthProvider>
        {modal}
      </body>
    </html>
  );
}
