import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import dynamic from "next/dynamic";
import { getServerSession } from "next-auth";
import { authOptions, cn } from "@/lib/utils";
import Sidebar from "@/components/Sidebar";
import Provider from "@/components/provider/query-provider";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";

const AuthProvider = dynamic(() => import("../../components/AuthProvider"), {
  ssr: false,
});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Terralab",
  description: "Dashboard",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  // console.log("app ===> ", session);
  if (!session) {
    redirect("/login");
  }
  // if (session && session.user.organizations.length == 0) {
  //   redirect("/register?step=3");
  // }
  return (
    <html lang="en">
      <body className={cn(inter.className, "flex")}>
        <AuthProvider>
          <Provider>
            {session && <Sidebar />}
            {children}
          </Provider>
        </AuthProvider>
        <Toaster position="bottom-center" />
        <script
          async
          type="text/javascript"
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&libraries=places`}
        ></script>
      </body>
    </html>
  );
}
