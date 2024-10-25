import React, { useEffect, useState } from "react";
import useAppContext from "../../../../../hooks/useAppContext";
import { Button, KIND, SIZE } from "baseui/button";
import { Slider } from "baseui/slider";
import { Select } from "baseui/select";
import Icons from "../../../icons";
import Fonts from "../../../../../constants/fonts";
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
function Text() {
  const { activeSelection, editor } = useAppContext();
  const [editingModeValue, setEditingModeValue] = useState(false);
  const [fontValue, setFontValue] = useState([]);
  const [spacingValue, setSpacingValue] = useState([0]);
  const [strokeWidthValue, setStrokeWidthValue] = useState([1]);
  const [transparencyValue, setTransparencyValue] = useState([1]);
  useEffect(() => {
    if (activeSelection) {
      setEditingModeValue(activeSelection.editingMode);
      setFontValue([{ fontFamily: activeSelection.fontFamily }]);
      setSpacingValue([activeSelection.spacing]);
      setStrokeWidthValue([activeSelection.strokeWidth]);
      setTransparencyValue([activeSelection.opacity]);
    }
  }, [activeSelection]);
  const setFont = (font) => {
    setFontValue(font);
    if (editor && font && font[0]) {
      editor.loadFont(font[0].fontFamily, () => {
        editor.update({ fontFamily: font[0].fontFamily });
      });
    }
  };
  const setEditing = () => {
    let isEditing = editor.isEditing();
    isEditing ? editor.exitEditingMode() : editor.enterEditingMode();
    setEditingModeValue(!isEditing);
    editor.setEditingModeAction(null);
  };
  const addText = () => {
    editor.addText();
  };
  const setStrokeWidth = (value) => {
    setStrokeWidthValue(value);
    editor.update({ strokeWidth: value[0] });
  };
  const setSpacing = (value) => {
    setSpacingValue(value);
    editor.update({ spacing: value[0] });
  };
  const setTransparency = (value) => {
    setTransparencyValue(value);
    editor.update({ opacity: value[0] });
  };
  const setStroke = (color) => {
    editor.update({ strokeColor: color });
  };
  const setFill = (color) => {
    editor.update({ fillColor: color });
  };
  const setTextAlign = (align) => {
    editor.update({ justification: align });
  };
  const bringToFront = () => {
    editor.bringToFront();
  };
  const sendToBack = () => {
    editor.sendToBack();
  };
  const removeActiveSelection = () => {
    let confirm = window.confirm("Are you sure ?");
    if (confirm) editor.removeActiveSelection();
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        height: "100%",
      }}
    >
      <div
        style={{
          padding: "10px",
          display:
            activeSelection && activeSelection._class === "PathText"
              ? "block"
              : "none",
          opacity: editor && editor.isEditing() ? 0.3 : 1,
          pointerEvents: editor && editor.isEditing() ? "none" : "auto",
        }}
      >
        <div
          style={{
            display: activeSelection ? "flex" : "none",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "30px",
          }}
        >
          <Button onClick={bringToFront} size={SIZE.mini} kind={KIND.tertiary}>
            Move to Front
          </Button>
          <Button onClick={sendToBack} size={SIZE.mini} kind={KIND.tertiary}>
            Send to Back
          </Button>
          <Button
            onClick={removeActiveSelection}
            size={SIZE.mini}
            kind={KIND.tertiary}
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
          <Select
            size={SIZE.compact}
            options={Fonts}
            value={fontValue}
            labelKey="fontFamily"
            valueKey="fontFamily"
            placeholder="Select font"
            onChange={(params) => setFont(params.value)}
            overrides={{
              ControlContainer: {
                style: {
                  borderLeftColor: "black",
                  borderTopColor: "black",
                  borderRightColor: "black",
                  borderBottomColor: "black",
                  borderLeftWidth: "1px",
                  borderRightWidth: "1px",
                  borderTopWidth: "1px",
                  borderBottomWidth: "1px",
                  borderLeftStyle: "solid",
                  borderRightStyle: "solid",
                  borderTopStyle: "solid",
                  borderBottomStyle: "solid",
                  backgroundColor: "transparent",
                },
              },
            }}
          />
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
          <label>Alignment</label>
          <Button
            onClick={() => {
              setTextAlign("left");
            }}
            size={SIZE.mini}
            kind={KIND.tertiary}
          >
            <Icons.AlignLeft size={20} />
          </Button>
          <Button
            onClick={() => {
              setTextAlign("center");
            }}
            size={SIZE.mini}
            kind={KIND.tertiary}
          >
            <Icons.AlignCenter size={20} />
          </Button>
          <Button
            onClick={() => {
              setTextAlign("right");
            }}
            size={SIZE.mini}
            kind={KIND.tertiary}
          >
            <Icons.AlignRight size={20} />
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
          <label> Spacing</label>
          <Slider
            overrides={{
              InnerThumb: () => null,
              //ThumbValue: () => null,
              TickBar: () => null,
              Thumb: {
                style: {
                  height: "20px",
                  width: "20px",
                },
              },
            }}
            min={-500}
            max={500}
            step={10}
            marks={false}
            value={spacingValue}
            onChange={({ value }) => value && setSpacing(value)}
          />
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
          <label> Stroke</label>
          <Slider
            overrides={{
              InnerThumb: () => null,
              ThumbValue: () => null,
              TickBar: () => null,
              Thumb: {
                style: {
                  height: "20px",
                  width: "20px",
                },
              },
            }}
            min={0}
            max={
              activeSelection ? Math.max(activeSelection.strokeWidth, 10) : 10
            }
            step={0.1}
            marks={false}
            value={strokeWidthValue}
            onChange={({ value }) => value && setStrokeWidth(value)}
          />
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
          <label>Stroke color</label>
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
                  setStroke(color);
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
          <label>Text color</label>
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
                  setFill(color);
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
          <label> Transparency</label>
          <Slider
            overrides={{
              InnerThumb: () => null,
              ThumbValue: () => null,
              TickBar: () => null,
              Thumb: {
                style: {
                  height: "20px",
                  width: "20px",
                },
              },
            }}
            min={0}
            max={1}
            step={0.01}
            marks={false}
            value={transparencyValue}
            onChange={({ value }) => value && setTransparency(value)}
          />
        </div>
      </div>

      <div
        style={{ display: "flex", flexDirection: "column", padding: "10px" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "30px",
            fontSize: "12px",
            fontWeight: 500,
            fontFamily: "system-ui",
          }}
        >
          {activeSelection && activeSelection._class === "PathText" ? (
            <Button
              onClick={setEditing}
              size={SIZE.mini}
              kind={KIND.tertiary}
              style={{
                marginRight: "10px",
              }}
              overrides={{
                BaseButton: {
                  style: ({ $theme }) => ({
                    borderColor: editingModeValue ? "red" : "black",
                    color: editingModeValue ? "red" : "black",
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
              {editingModeValue ? "Exit Editing" : "Edit Text"}
            </Button>
          ) : null}
          {editor && !editor.isEditing() ? (
            <Button
              onClick={addText}
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
              Add Text
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Text;
