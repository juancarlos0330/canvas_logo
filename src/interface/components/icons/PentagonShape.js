import React from "react";
function PentagonShape({ size }) {
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
      <path d="M4,0.213l3.984,2.894l-1.523,4.682l-4.923,-0.001l-1.522,-4.683l3.984,-2.894l0,0.001Zm0,0.471l3.536,2.569l-1.351,4.158l-4.371,-0l-1.351,-4.159l3.537,-2.568Z" />
    </svg>
  );
}
export default PentagonShape;
