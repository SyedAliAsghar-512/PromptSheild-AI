import React from "react";
import "../App.css";

const Loader = () => {
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-[#020817]"
      style={{ zIndex: 9999 }}
    >
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-cyan-400 animate-spin" />
        <div className="absolute inset-3 rounded-full bg-[#020817]" />
      </div>
    </div>
  );
};

export default Loader;