import Sidebar from "@/components/Sidebar";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Add Facility | C3 Insets",
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default Layout;
