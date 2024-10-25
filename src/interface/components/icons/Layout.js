import React from "react";
function Logo({ size }) {
  return (
    <svg
      height={size}
      viewBox="0 0 7 7"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.784,6.092l-6.568,-0l0,0.666l6.568,-0l0,-0.666Zm0,-1.369l-6.568,-0l0,0.667l6.568,-0l0,-0.667Zm-1.578,-2.775l-1.706,-1.706l-1.706,1.706l1.706,1.706l1.706,-1.706Z"
        fill="#212121"
      ></path>
    </svg>
  );
}
export default Logo;
