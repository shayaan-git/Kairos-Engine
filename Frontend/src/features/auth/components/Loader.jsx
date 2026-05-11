import React from "react";
import { ThreeDot } from "react-loading-indicators";
const Loader = () => (
  <div className="flex justify-center items-center min-h-screen bg-black">
    <ThreeDot
      variant="bounce"
      color="#00D5FF"
      size="large"
      text=""
      textColor=""
    />
  </div>
);

export default Loader;
