import React from "react";
import type { Metadata } from "next";
import "../globals.css";
import { Inter } from "next/font/google";
import Provider from "@/components/provider/query-provider";
import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "@/components/AuthProvider";

interface PropsWithChildren {
  children: React.ReactNode;
}

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "C3 Insets",
  description: "Dashboard",
};

const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <html>
      <body className={inter.className}>
        <AuthProvider>
          <Provider>{children}</Provider>
        </AuthProvider>
        <Toaster position="bottom-center" />
        <script
          type="text/javascript"
          async
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&libraries=places`}
        ></script>
      </body>
    </html>
  );
};

export default RootLayout;
