import React from "react";
import useAppContext from "../../../../hooks/useAppContext";
import { styled } from "baseui";
import PanelListItem from "./PanelListItem";

const panelListItems = [
  {
    id: "text",
    name: "Text",
  },
  {
    id: "layout",
    name: "Layout",
  },
  {
    id: "symmetry",
    name: "Symmetry",
  },
];

function PanelsList() {
  const { activePanel } = useAppContext();
  const Container = styled("div", () => ({
    width: "76px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "start",
    backgroundColor: "rgb(232, 232, 232)",
    borderLeft: "1px solid rgb(138,138,138)",
    borderRight: "1px solid rgb(138,138,138)",
  }));
  return (
    <Container>
      {panelListItems.map((panelListItem) => (
        <PanelListItem
          label={panelListItem.name}
          name={panelListItem.name}
          key={panelListItem.name}
          icon={panelListItem.name}
          activePanel={activePanel}
        />
      ))}
    </Container>
  );
}

export default PanelsList;
