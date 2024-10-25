import React from "react";
function RhombusShape({ size }) {
  return (
    <svg
      height={size}
      viewBox="0 0 9 9"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        fillRule: "evenodd",
        clipRule: "evenodd",
        strokeLineJoin: "round",
        strokeMiterLimit: 2,
      }}
    >
      <path d="M4.5,0.251l4.25,4.249l-4.251,4.25l-4.248,-4.252l4.249,-4.248Zm-0,0.539l3.712,3.711l-3.712,3.712l-3.712,-3.712l3.712,-3.711Z" />
    </svg>
  );
}
export default RhombusShape;
