import React from "react";
import { useStyletron } from "baseui";
import useAppContext from "../../../../hooks/useAppContext";
import Icons from "../../../../interface/components/icons";
function PanelListItem({ label, icon, activePanel }) {
  const { setActivePanel, editor } = useAppContext();
  const [css] = useStyletron();
  const Icon = Icons[icon];
  const setPanel = (label) => {
    editor.discardActiveSelection();
    editor.selectFirstElementByType(label);
    setActivePanel(label);
  };
  return (
    <div
      onClick={() => setPanel(label)}
      className={css({
        width: "76px",
        height: "76px",
        backgroundColor:
          label === activePanel ? "rgb(208,208,208)" : "rgb(232,232,232)",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
        fontSize: "12px",
        fontWeight: 500,
        fontFamily: "system-ui",
        userSelect: "none",
        transition: "all 0.3s",
        borderBottom: "1px solid rgb(138,138,138)",
        gap: "0.4rem",
        ":hover": {
          cursor: "pointer",
          backgroundColor: "rgb(208,208,208)",
          transition: "all 0.3s",
        },
      })}
    >
      <Icon size={30} />
      <div>{label}</div>
    </div>
  );
}

export default PanelListItem;
