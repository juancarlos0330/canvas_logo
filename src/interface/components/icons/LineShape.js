import React from "react";
function LineShape({ size }) {
  return (
    <svg
      height={size}
      viewBox="0 0 6 6"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        fillRule: "evenodd",
        clipRule: "evenodd",
        strokeLineJoin: "round",
        strokeMiterLimit: 2,
      }}
    >
      <line
        x1="0"
        y1="3"
        x2="6"
        y2="3"
        style={{ stroke: "black", strokeWidth: 0.3 }}
      />
    </svg>
  );
}
export default LineShape;
