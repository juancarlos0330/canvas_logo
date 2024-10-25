import React from "react";
function TriangleShape({ size }) {
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
      <path d="M4,0.233l3.767,7.534l-7.534,0l3.767,-7.534Zm0,0.85l3.152,6.304l-6.304,0l3.152,-6.304Z" />
    </svg>
  );
}
export default TriangleShape;
