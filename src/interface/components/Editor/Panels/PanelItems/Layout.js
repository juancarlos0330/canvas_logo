import React, { useState, useEffect } from "react";
import useAppContext from "../../../../../hooks/useAppContext";
import { Button, KIND, SIZE } from "baseui/button";
import { Slider } from "baseui/slider";
import { Checkbox, STYLE_TYPE } from "baseui/checkbox";
import Icons from "../../../icons";

const colorsList = [
  "#000000",
  "#212121",
  "#424242",
  "#5e5e5e",
  "#797979",
  "#919191",
  "#929292",
  "#a9a9a9",
  "#c0c0c0",
  "#cecece",
  "#ebebeb",
  "#fff",
  // end row
  "#941100",
  "#945200",
  "#929000",
  "#4f8f00",
  "#008f00",
  "#009051",
  "#009193",
  "#005493",
  "#011993",
  "#531b93",
  "#942193",
  "#941751",
  // end row
  "#ff2600",
  "#ff9300",
  "#fffb00",
  "#8efa00",
  "#00f900",
  "#00fa92",
  "#00fdff",
  "#0096ff",
  "#0433ff",
  "#9437ff",
  "#ff40ff",
  "#ff2f92",
  // end row
  "#ff7e79",
  "#ffd479",
  "#fffc79",
  "#d4fb79",
  "#73fa79",
  "#73fcd6",
  "#73fdff",
  "#76d6ff",
  "#7a81ff",
  "#d783ff",
  "#ff85ff",
  "#ff8ad8",
];
function Layout() {
  const { activeSelection, editor } = useAppContext();
  const [gridCheckbox, setGridCheckbox] = useState(true);

  useEffect(() => {
    if (editor) {
      setGridCheckbox(editor.handlers.layersHandler.grid);
    }
  }, [activeSelection, editor]);

  const addShape = (shape) => {
    editor.addShape(shape, true);
  };
  const bringToFront = () => {
    editor.bringToFront();
  };
  const sendToBack = () => {
    editor.sendToBack();
  };
  const selectAllShapes = () => {
    editor.selectAllShapes();
  };
  const fitToScreen = () => {
    editor.fitToScreen();
  };
  const removeActiveSelection = () => {
    let confirm = window.confirm("Are you sure ?");
    if (confirm) editor.removeActiveSelection();
  };
  const setGrid = (value) => {
    setGridCheckbox(value);
    editor.setGrid(value);
  };
  const setBackground = (color) => {
    editor.setBackgroundFill(color);
  };
  const alignLogo = (value) => {
    editor.alignLogo(value);
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
      }}
    >
      <div
        style={{
          padding: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "30px",
          }}
        >
          <Button
            onClick={bringToFront}
            size={SIZE.mini}
            kind={KIND.tertiary}
            overrides={{
              BaseButton: {
                style: ({ $theme }) => ({
                  color: activeSelection ? "black" : "gray",
                }),
              },
            }}
          >
            Move to Front
          </Button>
          <Button
            onClick={sendToBack}
            size={SIZE.mini}
            kind={KIND.tertiary}
            overrides={{
              BaseButton: {
                style: ({ $theme }) => ({
                  color: activeSelection ? "black" : "gray",
                }),
              },
            }}
          >
            Send to Back
          </Button>
          <Button
            onClick={removeActiveSelection}
            size={SIZE.mini}
            kind={KIND.tertiary}
            overrides={{
              BaseButton: {
                style: ({ $theme }) => ({
                  color: activeSelection ? "black" : "gray",
                }),
              },
            }}
          >
            Delete
          </Button>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "30px",
            fontSize: "12px",
            fontWeight: 500,
            fontFamily: "system-ui",
          }}
        >
          <Button
            onClick={() => {
              alignLogo("top");
            }}
            size={SIZE.mini}
            kind={KIND.tertiary}
          >
            <Icons.LogoTop size={60} />
          </Button>
          <Button
            onClick={() => {
              alignLogo("left");
            }}
            size={SIZE.mini}
            kind={KIND.tertiary}
          >
            <Icons.LogoLeft size={60} />
          </Button>
          <Button
            onClick={() => {
              alignLogo("bottom");
            }}
            size={SIZE.mini}
            kind={KIND.tertiary}
          >
            <Icons.LogoBottom size={60} />
          </Button>
          <Button
            onClick={() => {
              alignLogo("right");
            }}
            size={SIZE.mini}
            kind={KIND.tertiary}
          >
            <Icons.LogoRight size={60} />
          </Button>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "start",
            marginBottom: "30px",
            fontSize: "12px",
            fontWeight: 500,
            fontFamily: "system-ui",
          }}
        >
          <label style={{ color: gridCheckbox ? "gray" : "inherit" }}>
            Hide Grid
          </label>
          <Checkbox
            checked={gridCheckbox}
            onChange={(e) => {
              setGrid(e.currentTarget.checked);
            }}
            checkmarkType={STYLE_TYPE.toggle_round}
            overrides={{
              Toggle: {
                style: ({ $checked, $theme }) => ({
                  backgroundColor: "#000000",
                }),
              },
            }}
          ></Checkbox>
          <label style={{ color: gridCheckbox ? "inherit" : "gray" }}>
            Show Grid
          </label>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "30px",
            fontSize: "12px",
            fontWeight: 500,
            fontFamily: "system-ui",
          }}
        >
          <label>Background</label>
          <div
            style={{
              display: "grid",
              grid: "16px / auto auto auto auto auto auto auto auto auto auto auto auto",
              gap: "1px",
            }}
          >
            {colorsList.map((color, index) => (
              <div
                onClick={() => {
                  setBackground(color);
                }}
                key={index}
                style={{
                  width: "16px",
                  height: "16px",
                  backgroundColor: color,
                  cursor: "pointer",
                }}
              ></div>
            ))}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "30px",
            fontSize: "12px",
            fontWeight: 500,
            fontFamily: "system-ui",
          }}
        >
          <label>Add Shape</label>
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "start",
              }}
            >
              <Button
                onClick={() => {
                  addShape("line");
                }}
                size={SIZE.mini}
                kind={KIND.tertiary}
              >
                <Icons.LineShape size={16} />
              </Button>
              <Button
                onClick={() => {
                  addShape("circle");
                }}
                size={SIZE.mini}
                kind={KIND.tertiary}
              >
                <Icons.CircleShape size={16} />
              </Button>
              <Button
                onClick={() => {
                  addShape("rectangle");
                }}
                size={SIZE.mini}
                kind={KIND.tertiary}
              >
                <Icons.RectangleShape size={16} />
              </Button>
              <Button
                onClick={() => {
                  addShape("triangle");
                }}
                size={SIZE.mini}
                kind={KIND.tertiary}
              >
                <Icons.TriangleShape size={16} />
              </Button>
              <Button
                onClick={() => {
                  addShape("rhombus");
                }}
                size={SIZE.mini}
                kind={KIND.tertiary}
              >
                <Icons.RhombusShape size={16} />
              </Button>
              <Button
                onClick={() => {
                  addShape("pentagon");
                }}
                size={SIZE.mini}
                kind={KIND.tertiary}
              >
                <Icons.PentagonShape size={16} />
              </Button>
              <Button
                onClick={() => {
                  addShape("hexagon");
                }}
                size={SIZE.mini}
                kind={KIND.tertiary}
              >
                <Icons.HexagonShape size={16} />
              </Button>
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-evenly",
            marginBottom: "30px",
            fontSize: "12px",
            fontWeight: 500,
            fontFamily: "system-ui",
          }}
        >
          <Button
            onClick={selectAllShapes}
            size={SIZE.mini}
            kind={KIND.tertiary}
            overrides={{
              BaseButton: {
                style: ({ $theme }) => ({
                  borderColor: "black",
                  borderLeftWidth: "1px",
                  borderRightWidth: "1px",
                  borderTopWidth: "1px",
                  borderBottomWidth: "1px",
                  borderLeftStyle: "solid",
                  borderRightStyle: "solid",
                  borderTopStyle: "solid",
                  borderBottomStyle: "solid",
                }),
              },
            }}
          >
            Select All Shapes
          </Button>
          <Button
            onClick={fitToScreen}
            size={SIZE.mini}
            kind={KIND.tertiary}
            overrides={{
              BaseButton: {
                style: ({ $theme }) => ({
                  borderColor: "black",
                  borderLeftWidth: "1px",
                  borderRightWidth: "1px",
                  borderTopWidth: "1px",
                  borderBottomWidth: "1px",
                  borderLeftStyle: "solid",
                  borderRightStyle: "solid",
                  borderTopStyle: "solid",
                  borderBottomStyle: "solid",
                }),
              },
            }}
          >
            Fit to Screen
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Layout;
