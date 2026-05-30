import React from "react";
import { Riple } from "react-loading-indicators";
const Loader = () => (
  <div className="flex justify-center items-center min-h-screen bg-stone-900">
    <Riple
      color="#d9d9d9"
      size="small"
      text=""
      textColor=""
    />
  </div>
);

export default Loader;
