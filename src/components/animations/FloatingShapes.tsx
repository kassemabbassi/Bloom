import React from "react";

const FloatingShapes = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Purple Shape Top Left */}
      <div
        className="floating-shape bg-wellness-400 w-64 h-64 -left-20 -top-20 animate-float-fast"
        style={{ animationDelay: "-1s" }}
      ></div>
      
      {/* Mint Shape Top Right */}
      <div
        className="floating-shape bg-mint-400 w-80 h-80 -right-40 top-10 animate-float-fast"
        style={{ animationDelay: "-3s" }}
      ></div>
      
      {/* Blue Shape Bottom Left */}
      <div
        className="floating-shape bg-calm-300 w-96 h-96 -left-48 bottom-20 animate-float-fastest"
        style={{ animationDelay: "-5s" }}
      ></div>
      
      {/* Small Purple Accent */}
      <div
        className="floating-shape bg-wellness-500 w-20 h-20 right-32 top-1/4 animate-float-fast"
        style={{ animationDelay: "-2s" }}
      ></div>
      
      {/* Small Mint Accent */}
      <div
        className="floating-shape bg-mint-300 w-24 h-24 left-1/4 bottom-1/3 animate-float-fast"
        style={{ animationDelay: "-4s" }}
      ></div>
      
      {/* Small Calm Accent */}
      <div
        className="floating-shape bg-calm-200 w-16 h-16 right-1/3 bottom-1/4 animate-float-fastest"
        style={{ animationDelay: "-1.5s" }}
      ></div>
    </div>
  );
};

export default FloatingShapes;
