import React from "react";
import useAppContext from "../../../../hooks/useAppContext";
import { styled } from "baseui";
import PanelItems from "./PanelItems";

function PanelsList() {
  const { activePanel } = useAppContext();

  const Container = styled("div", (props) => ({
    background: "rgb(208,208,208)",
    width: "320px",
    display: "block",
    height: "100%",
    //minHeight: "300px",
    overflowY: "auto",
  }));
  const Component = PanelItems[activePanel];

  return <Container>{Component && <Component />}</Container>;
}

export default PanelsList;
