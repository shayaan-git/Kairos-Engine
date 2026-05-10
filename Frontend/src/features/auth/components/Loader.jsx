import React from "react";
import { ThreeDot } from "react-loading-indicators";
const Loader = () => (
  <div className="flex justify-center items-center min-h-screen">
    <ThreeDot
      variant="bounce"
      color="#ff9999"
      size="large"
      text=""
      textColor=""
    />
  </div>
);

export default Loader;
