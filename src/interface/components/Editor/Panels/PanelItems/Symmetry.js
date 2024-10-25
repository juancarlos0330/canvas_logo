import React, { useEffect, useState } from "react";
import useAppContext from "../../../../../hooks/useAppContext";
import { Button, KIND, SIZE } from "baseui/button";
import { Slider } from "baseui/slider";
import { Checkbox, STYLE_TYPE } from "baseui/checkbox";
import Icons from "../../../icons";
import { useStyletron } from "baseui";
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
function Panel() {
  const [css, theme] = useStyletron();
  const { activeSelection, activeEditingModeHandle, editor } = useAppContext();
  const [editingModeValue, setEditingModeValue] = useState(false);
  const [isEditingGradient, setIsEditingGradient] = useState(false);
  const [symmetrySidesValue, setSymmetrySidesValue] = useState([3]);
  const [strokeWidthValue, setStrokeWidthValue] = useState([24]);
  const [transparencyValue, setTransparencyValue] = useState([1]);
  const [closedPath, setClosedPath] = useState(false);
  const [flipPath, setFlipPath] = useState(true);
  useEffect(() => {
    if (activeSelection && editor) {
      setClosedPath(activeSelection.closed);
      setEditingModeValue(editor.isEditing());
      setStrokeWidthValue([activeSelection.strokeWidth * 4]);
      setSymmetrySidesValue([activeSelection.amount]);
      setTransparencyValue([activeSelection.opacity]);
    }
  }, [editor, activeSelection, activeEditingModeHandle]);
  const setEditing = () => {
    let isEditing = editor.isEditing();
    isEditing ? editor.exitEditingMode() : editor.enterEditingMode();
    setEditingModeValue(!isEditing);
  };
  const setEditingGradient = () => {
    setIsEditingGradient(!isEditingGradient);
  };
  const setEditingAction = (action) => {
    editor.setEditingAction(action);
  };
  const setSymmetrySides = (value) => {
    setSymmetrySidesValue(value);
    editor.setSymmetrySides(value[0]);
  };
  const setStrokeWidth = (value) => {
    setStrokeWidthValue(value);
    editor.update({ strokeWidth: value[0] / 4 });
  };
  const setTransparency = (value) => {
    setTransparencyValue(value);
    editor.update({ opacity: value[0] });
  };
  const setStroke = (color) => {
    let bounds = activeSelection.getBounds();
    let gradient = {
      gradient: { stops: [color, color] },
      origin: [bounds.x, bounds.y],
      destination: [bounds.x + bounds.width, bounds.y + bounds.height]
    }
    editor.update({ strokeColor: gradient });
  };
  const setStrokeGradient = (index, color) => {
    let bounds = activeSelection.getBounds();
    let oldColor = activeSelection.getStrokeColor().type === "rgb"
      ? activeSelection.getStrokeColor()._canvasStyle
      : index === 0
        ? activeSelection.getStrokeColor().gradient.stops[1].color._canvasStyle
        : activeSelection.getStrokeColor().gradient.stops[0].color._canvasStyle;
    let gradientColor = {
      gradient: {
        stops: index === 0 ? [color, oldColor] : [oldColor, color]
      },
      origin: [bounds.x, bounds.y],
      destination: [bounds.x + bounds.width, bounds.y]
    }
    editor.update({ strokeColor: gradientColor });
  };
  const setShapeGradient = (index, color) => {
    let bounds = activeSelection.getBounds();
    let oldColor = activeSelection.getFillColor().type === "rgb"
      ? activeSelection.getFillColor()._canvasStyle
      : index === 0
        ? activeSelection.getFillColor().gradient.stops[1].color._canvasStyle
        : activeSelection.getFillColor().gradient.stops[0].color._canvasStyle;
    let gradientColor = {
      gradient: {
        stops: index === 0 ? [color, oldColor] : [oldColor, color]
      },
      origin: [bounds.x, bounds.y],
      destination: [bounds.x + bounds.width, bounds.y]
    }
    editor.update({ fillColor: gradientColor });
  };
  const setFill = (color) => {
    let bounds = activeSelection.getBounds();
    let gradient = {
      gradient: { stops: [color, color] },
      origin: [bounds.x, bounds.y],
      destination: [bounds.x + bounds.width, bounds.y + bounds.height]
    }
    editor.update({ fillColor: gradient });
  };
  const setStrokeCap = (cap) => {
    editor.update({ strokeCap: cap });
  };
  const setStrokeJoin = (join) => {
    editor.update({ strokeJoin: join });
  };
  const setClosed = (value) => {
    setClosedPath(value);
    editor.update({ closed: value });
    if (!value) {
      editor.update({ fillColor: "rgba(0,0,0,0.001)" });
    }
  };
  const setFlip = (value) => {
    setFlipPath(value);
    editor.setFlipOption(value);
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
        display:
          activeSelection && activeSelection._class === "Path"
            ? "flex"
            : "none",
        flexDirection: "column",
        justifyContent: "start",
        height: "100%",
      }}
    >
      <div
        style={{
          padding: "10px",
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
            opacity: isEditingGradient ? 0.3 : 1,
            pointerEvents: isEditingGradient ? "none" : "auto",
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
            opacity: isEditingGradient ? 0.3 : 1,
            pointerEvents: isEditingGradient ? "none" : "auto",
          }}
        >
          <label> Rotate </label>
          <Slider
            persistentThumb
            overrides={{
              InnerThumb: () => null,
              //ThumbValue: () => null,
              ThumbValue: ({ $value }) => (
                <div
                  className={css({
                    position: "absolute",
                    top: `${theme.sizing.scale800 / 2}`,
                    ...theme.typography.font200,
                    backgroundColor: "transparent",
                    color: "white",
                  })}
                >
                  {$value}
                </div>
              ),
              TickBar: () => null,
              Thumb: {
                style: {
                  height: "20px",
                  width: "20px",
                },
              },
            }}
            min={1}
            max={10}
            step={1}
            marks={false}
            value={symmetrySidesValue}
            onChange={({ value }) => value && setSymmetrySides(value)}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            opacity: isEditingGradient ? 0.3 : 1,
            pointerEvents: isEditingGradient ? "none" : "auto",
          }}>
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
            <label style={{ color: closedPath ? "gray" : "inherit" }}>
              Open
            </label>
            <Checkbox
              checked={closedPath}
              onChange={(e) => {
                setClosed(e.currentTarget.checked);
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
            <label style={{ color: closedPath ? "inherit" : "gray" }}>
              Closed
            </label>
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
            <label style={{ color: flipPath ? "gray" : "inherit" }}>
              Flip On
            </label>
            <Checkbox
              checked={flipPath}
              onChange={(e) => {
                setFlip(e.currentTarget.checked);
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
            <label style={{ color: flipPath ? "inherit" : "gray" }}>
              Flip Off
            </label>
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
            opacity: isEditingGradient ? 0.3 : 1,
            pointerEvents: isEditingGradient ? "none" : "auto",
          }}
        >
          <label> Stroke</label>
          <Slider
            persistentThumb
            overrides={{
              InnerThumb: () => null,
              //ThumbValue: () => null,
              ThumbValue: ({ $value }) => (
                <div
                  className={css({
                    position: "absolute",
                    top: `${theme.sizing.scale800 / 2}`,
                    ...theme.typography.font200,
                    backgroundColor: "transparent",
                    color: "white",
                  })}
                >
                  {$value}
                </div>
              ),
              TickBar: () => null,
              Thumb: {
                style: {
                  height: "20px",
                  width: "20px",
                },
              },
            }}
            min={1}
            max={
              activeSelection ? Math.max(activeSelection.strokeWidth, 30) : 30
            }
            step={1}
            marks={false}
            value={strokeWidthValue}
            onChange={({ value }) => value && setStrokeWidth(value)}
          />
        </div>
        {!isEditingGradient && <div
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
          <label style={{ width: "40px" }}>Cap</label>
          <Button
            onClick={() => {
              setStrokeCap("round");
            }}
            size={SIZE.mini}
            kind={KIND.tertiary}
          >
            <Icons.StrokeCapRound size={20} />
          </Button>
          <Button
            onClick={() => {
              setStrokeCap("square");
            }}
            size={SIZE.mini}
            kind={KIND.tertiary}
          >
            <Icons.StrokeCapSquare size={20} />
          </Button>
          <Button
            onClick={() => {
              setStrokeCap("butt");
            }}
            size={SIZE.mini}
            kind={KIND.tertiary}
          >
            <Icons.StrokeCapButt size={20} />
          </Button>
        </div>}
        {!isEditingGradient && <div
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
          <label>Corner</label>
          <Button
            onClick={() => {
              setStrokeJoin("round");
            }}
            size={SIZE.mini}
            kind={KIND.tertiary}
          >
            <Icons.StrokeJoinRound size={20} />
          </Button>
          <Button
            onClick={() => {
              setStrokeJoin("bevel");
            }}
            size={SIZE.mini}
            kind={KIND.tertiary}
          >
            <Icons.StrokeJoinBevel size={20} />
          </Button>
          <Button
            onClick={() => {
              setStrokeJoin("miter");
            }}
            size={SIZE.mini}
            kind={KIND.tertiary}
          >
            <Icons.StrokeJoinMiter size={20} />
          </Button>
        </div>}
        {!isEditingGradient && <div
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
        </div>}
        <fieldset
          style={{ display: isEditingGradient ? "block" : "none" }}
        >
          <legend>Stroke Gradient:</legend>
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
            <label>Color 1</label>
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
                    setStrokeGradient(0, color);
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
            <label>Color 2</label>
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
                    setStrokeGradient(1, color);
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
        </fieldset>
        {!isEditingGradient && <div
          style={{
            display: closedPath ? "flex" : "none",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "30px",
            fontSize: "12px",
            fontWeight: 500,
            fontFamily: "system-ui",
          }}
        >
          <label>Shape color</label>
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
        </div>}
        <fieldset
          style={{
            display: isEditingGradient && closedPath ? "block" : "none",
            marginTop: "20px"
          }}
        >
          <legend>Shape Gradient:</legend>
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
            <label>Color 1</label>
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
                    setShapeGradient(0, color);
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
            <label>Color 2</label>
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
                    setShapeGradient(1, color);
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
        </fieldset>
        {!isEditingGradient && <div
          style={{
            display: closedPath ? "flex" : "none",
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
        </div>}
      </div>

      <div
        style={{ display: "flex", flexDirection: "column", padding: "10px" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            marginBottom: "10px",
            fontSize: "12px",
            fontWeight: 500,
            fontFamily: "system-ui",
          }}
        >
          {!editingModeValue && <Button
            onClick={setEditingGradient}
            size={SIZE.mini}
            kind={KIND.tertiary}
            overrides={{
              BaseButton: {
                style: ({ $theme }) => ({
                  borderColor: isEditingGradient ? "red" : "black",
                  color: isEditingGradient ? "red" : "black",
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
            {isEditingGradient ? "Exit Gradient" : "Gradient"}
          </Button>}
          {!isEditingGradient && <Button
            onClick={setEditing}
            size={SIZE.mini}
            kind={KIND.tertiary}
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
            {editingModeValue ? "Exit Editing" : "Node Editor"}
          </Button>}
        </div>
        <div
          style={{
            display:
              editor && editor.isEditing() && activeEditingModeHandle
                ? "flex"
                : "none",
            alignItems: "center",
            justifyContent: "space-evenly",
            fontSize: "12px",
            fontWeight: 500,
            fontFamily: "system-ui",
            marginBottom: "30px",
          }}
        >
          <Button
            overrides={{
              BaseButton: {
                style: ({ $theme }) => ({
                  display:
                    activeEditingModeHandle === "segment" ? "block" : "none",
                }),
              },
            }}
            onClick={() => {
              setEditingAction("add");
            }}
            size={SIZE.mini}
            kind={KIND.tertiary}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Icons.NodeAdd size={24} />
              <span style={{ marginTop: "7px" }}>Add Node</span>
            </div>
          </Button>
          <Button
            overrides={{
              BaseButton: {
                style: ({ $theme }) => ({
                  display:
                    activeEditingModeHandle === "segment" ? "block" : "none",
                }),
              },
            }}
            onClick={() => {
              setEditingAction("remove");
            }}
            size={SIZE.mini}
            kind={KIND.tertiary}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Icons.NodeRemove size={24} />
              <span style={{ marginTop: "7px" }}>Delete Node</span>
            </div>
          </Button>
          <Button
            overrides={{
              BaseButton: {
                style: ({ $theme }) => ({
                  display:
                    activeEditingModeHandle === "curve" ? "block" : "none",
                }),
              },
            }}
            onClick={() => {
              setEditingAction("straight");
            }}
            size={SIZE.mini}
            kind={KIND.tertiary}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Icons.NodeStraight size={24} />
              <span style={{ marginTop: "7px" }}>Center Node</span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Panel;
