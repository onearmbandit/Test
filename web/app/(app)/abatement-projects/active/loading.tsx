import { Loader2 } from "lucide-react";
import React from "react";

const loading = () => {
  return (
    <div className="h-screen w-screen grid place-items-center">
      <Loader2 size={40} className="animate-spin text-blue-600" />
    </div>
  );
};

export default loading;
