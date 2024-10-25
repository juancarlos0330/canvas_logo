import React from "react";
import { Button, KIND, SHAPE, SIZE } from "baseui/button";
import useAppContext from "../../../hooks/useAppContext";
import Navbar from "../Editor/Navbar";
import Icons from "../../../interface/components/icons";
import { useStyletron } from "baseui";

import Template3Sides from "../../../assets/templates/3sides.json";
import Template4Sides from "../../../assets/templates/4sides.json";
import Template6Sides from "../../../assets/templates/6sides.json";
import Template8Sides from "../../../assets/templates/8sides.json";
function Templates() {
  const { setPage, setTemplate, isMobile } = useAppContext();
  const [css] = useStyletron();

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "rgb(30,30,30)",
      }}
    >
      <div
        style={{
          display: isMobile ? "flex" : "none",
          width: "100%",
          height: "100%",
          position: "absolute",
          userSelect: "none",
          zIdex: 100,
          backgroundColor: "rgb(30,30,30)",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            flexDirection: "column",
            color: "#fff",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h3
            style={{
              marginBottom: "0px",
              fontSize: "20pt",
              fontWeight: 500,
              textAlign: "center",
              fontFamily: "system-ui",
            }}
          >
            LogoCentrix is developed for desktop, functional mobile version is
            coming soon.
          </h3>
        </div>
      </div>
      <Navbar />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          color: "#fff",
          //justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h3
          style={{
            marginBottom: "0px",
            fontSize: "38pt",
            fontWeight: 500,
            textAlign: "center",
            fontFamily: "system-ui",
          }}
        >
          A game changer in Logo Design
        </h3>
        <h3
          style={{
            marginBottom: "60px",
            fontSize: "21pt",
            fontWeight: 500,
            maxWidth: "45%",
            textAlign: "center",
            fontFamily: "system-ui",
          }}
        >
          The very first dynamic logo creator engine, with amazing editable
          built-in functions. <br /> No need of graphic design knowledge, just
          play!
        </h3>
        <Button
          onClick={() => {
            setPage("Editor");
            setTemplate(Template3Sides);
          }}
          size={SIZE.large}
          shape={SHAPE.square}
          overrides={{
            BaseButton: {
              style: ({ $theme }) => ({
                backgroundColor: "rgb(28,141, 245)",
                color: "#fff",
                fontSize: "28pt",
                paddingLeft: "100px",
                paddingRight: "100px",
                paddingTop: "35px",
                paddingBottom: "35px",
              }),
            },
          }}
        >
          Start
        </Button>
      </div>
    </div>
  );
}

export default Templates;
