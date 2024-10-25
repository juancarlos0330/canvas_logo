import React from "react";
function CircleShape({ size }) {
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
      <path d="M4,0.146c2.128,0 3.855,1.727 3.855,3.855c0,2.127 -1.727,3.854 -3.855,3.854c-2.127,0 -3.855,-1.728 -3.855,-3.855c0,-2.128 1.728,-3.855 3.855,-3.855l0,0.001Zm0,0.381c1.918,0 3.475,1.557 3.475,3.475c0,1.918 -1.557,3.475 -3.475,3.475c-1.917,0 -3.475,-1.558 -3.475,-3.475c0,-1.918 1.558,-3.475 3.475,-3.475Z" />
    </svg>
  );
}
export default CircleShape;
