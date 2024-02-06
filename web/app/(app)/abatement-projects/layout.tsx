import Header from "@/components/Header";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-gray-50 w-full ">
      <Header />
      <div className="px-8 pb-8">{children}</div>
    </div>
  );
};

export default layout;
