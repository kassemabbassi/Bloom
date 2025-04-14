import { useState, useEffect } from "react";
import FaceDetection from "@/components/FaceDetection";




export const ExpressionDetector = () => {
  return (
    <div className="mb-10">
      <FaceDetection />
    </div>
  );
};

export default ExpressionDetector;