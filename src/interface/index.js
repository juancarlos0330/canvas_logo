import React, { useEffect } from "react";
import useAppContext from "../hooks/useAppContext";
import Templates from "./components/Templates/";
import Editor from "./components/Editor/";
function Interface() {
  const { page } = useAppContext();
  let Pages = {
    Templates: Templates,
    Editor: Editor,
  };
  const PageComponent = Pages[page];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {PageComponent && <PageComponent />}
    </div>
  );
}

export default Interface;
