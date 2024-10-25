import React from "react";
function RectangleShape({ size }) {
  return (
    <svg
      height={size}
      viewBox="0 0 8 8"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        fillRule: "evenodd",
        clipRule: "evenodd",
        strokeLineJoin: "round",
        strokeMiterLimit: 2,
      }}
    >
      <path d="M7.801,0.199l-7.602,0l0,7.603l7.602,-0.002l0,-7.601l0,0Zm-0.38,0.381l0,6.842l-6.842,-0.001l0,-6.842l6.842,0.001Z" />
    </svg>
  );
}
export default RectangleShape;
