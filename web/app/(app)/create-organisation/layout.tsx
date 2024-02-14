import Provider from "@/components/provider/query-provider";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="absolute inset-0 h-screen z-50">
      {children}
    </div>
  );
};

export default Layout;
