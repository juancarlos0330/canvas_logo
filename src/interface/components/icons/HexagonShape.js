import React from "react";
function HexagonShape({ size }) {
  return (
    <svg
      height={size}
      viewBox="0 0 8 9"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        fillRule: "evenodd",
        clipRule: "evenodd",
        strokeLineJoin: "round",
        strokeMiterLimit: 2,
      }}
    >
      <path d="M4,0.313l3.627,2.093l-0,4.188l-3.627,2.094l-3.627,-2.093l0,-4.188l3.627,-2.094Zm0,0.439l3.247,1.874l0,3.75l-3.247,1.874l-3.247,-1.875l0,-3.75l3.247,-1.874l0,0.001Z" />
    </svg>
  );
}
export default HexagonShape;
