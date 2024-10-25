import React from "react";
import Canvas from "../../../canvas";
import Navbar from "./Navbar";
import Panels from "./Panels";

function Editor() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#F9F9F9",
      }}
    >
      <Navbar />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flex: 1,
          overflow: "hidden",
        }}
      >
        <Canvas />
        <Panels />
      </div>
    </div>
  );
}

export default Editor;
