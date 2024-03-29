import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-gray-50 w-full ">
      <div className="">{children}</div>
    </div>
  );
};

export default layout;
