import React, { useState, useEffect } from "react";
import { styled, ThemeProvider, DarkTheme } from "baseui";
import { StatefulPopover } from "baseui/popover";
import { Slider } from "baseui/slider";
import { Button, KIND, SHAPE, SIZE } from "baseui/button";
import { Checkbox, LABEL_PLACEMENT } from "baseui/checkbox";
import { Input } from "baseui/input";
import useAppContext from "../../../../hooks/useAppContext";
import Icons from "../../icons";

const Container = styled("div", (props) => ({
  height: "36px",
  background: "rgb(83,83,83)",
  display: "flex",
  padding: "0 1rem",
  justifyContent: "space-between",
  alignItems: "center",
  overflow: "hidden",
}));

function Navbar() {
  const { editor, page, setPage, setTemplate, zoom } = useAppContext();

  const [zoomValue, setZoomValue] = useState([5]);
  const [logoFile, setLogoFile] = useState(true);
  const [lowRes, setLowRes] = useState(false);
  const [lowResBg, setLowResBg] = useState(false);
  const [highRes, setHighRes] = useState(false);
  const [highResBg, setHighResBg] = useState(false);
  const [svg, setSvg] = useState(true);
  const [fileName, setFileName] = useState("LogoCentrix");

  useEffect(() => {
    if (editor) {
      setZoomValue([editor.getZoom()]);
    }
  }, [editor, zoom]);

  const generateUUID = (ext) => {
    return `xxxxxxxx.${ext}`.replace(/[x]/g, (c) => {
      let r = (Math.random() * 16) | 0,
        v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };
  const downloadFile = (type, string, ext) => {
    let blob = new Blob([string], {
      type: type,
    });
    let url = URL.createObjectURL(blob);
    let link = document.createElement("a");
    link.href = url;
    link.download = `${fileName || "logoCentrix"}.${ext}`; //generateUUID(ext);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const importTemplate = async () => {
    let fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".sym";
    fileInput.onchange = (event) => {
      let reader = new FileReader();
      reader.onload = (e) => {
        let template = JSON.parse(e.target.result);
        if (page !== "Editor") {
          setPage("Editor");
          setTemplate(template);
        } else {
          editor.importTemplate(template);
        }
      };
      reader.readAsText(fileInput.files[0]);
    };
    fileInput.click();
  };
  const exportTemplate = () => {
    downloadFile("application/json", editor.exportTemplate(), "sym");
  };
  const download = () => {
    if (logoFile) {
      exportTemplate();
    }
    if (lowRes) {
      downloadImage("png", "low", false, false);
    }
    if (lowResBg) {
      downloadImage("png", "low", true, true);
    }
    if (highRes) {
      downloadImage("png", "high", false, false);
    }
    if (highResBg) {
      downloadImage("png", "high", true, true);
    }
    if (svg) {
      downloadImage("svg");
    }
  };
  const downloadImage = (type, resolution, background) => {
    resolution = resolution === "low" ? 500 : 1000;
    if (type === "png") {
      let link = document.createElement("a");
      link.href = editor.exportPng(resolution, background);
      link.download = `${fileName || "logoCentrix"}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    if (type === "svg") {
      downloadFile("image/svg+xml;charset=utf-8", editor.exportSvg(), "svg");
    }
  };

  const setPageWithConfirm = (page) => {
    let confirm = window.confirm("Exit without saving ?");
    if (confirm) setPage(page);
  };
  const setPageWithoutConfirm = (page) => {
    setPage(page);
  };

  const undo = () => {
    if (editor) editor.undo();
  };

  const redo = () => {
    if (editor) editor.redo();
  };

  const updateZoom = (value) => {
    setZoomValue(value);
    editor.setZoom(value[0]);
  };

  const updateZoomPlus = () => {
    let value = editor.getZoom() + 0.2;
    setZoomValue([value]);
    editor.setZoom(value);
  };
  const updateZoomMinus = () => {
    let value = editor.getZoom() - 0.2;
    setZoomValue([value]);
    editor.setZoom(value);
  };

  return (
    <ThemeProvider theme={DarkTheme}>
      <Container>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: "#fff",
                fontFamily: "system-ui",
                fontSize: "10pt",
                marginLeft: "10px",
                marginRight: "10px",
              }}
            >
              <span style={{ marginLeft: "10px", fontWeight: "bold" }}>
                LogoCentrix
              </span>
            </div>
            {page === "Editor" ? (
              <Button
                onClick={() => {
                  setPageWithConfirm("Templates");
                }}
                size={SIZE.mini}
                kind={KIND.tertiary}
              >
                New
              </Button>
            ) : null}
            {page === "Editor" ? (
              <Button
                onClick={importTemplate}
                size={SIZE.mini}
                kind={KIND.tertiary}
              >
                Open
              </Button>
            ) : null}
            {page === "Editor" ? (
              <Button onClick={undo} size={SIZE.mini} kind={KIND.tertiary}>
                Undo
              </Button>
            ) : null}
            {page === "Editor" ? (
              <Button onClick={redo} size={SIZE.mini} kind={KIND.tertiary}>
                Redo
              </Button>
            ) : null}
            {page === "Editor" ? (
              <StatefulPopover
                content={({ close }) => (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100vw",
                      textAlign: "center",
                      background: "rgb(30,30,30)",
                      padding: "10px",
                      fontFamily: "system-ui",
                      maxWidth: "600px",
                    }}
                  >
                    <div style={{ textAlign: "left", fontSize: "11pt" }}>
                      <p>
                        We are two guys with the head in the clouds who dreamed
                        about this app, and one very skilled coder who made it
                        alive.
                      </p>
                      <p>
                        We get inspired mostly while having a beer, so we never
                        say no, to one beer more.
                      </p>
                      <p>
                        If you feel like giving us a beer, do it via paypal, if
                        you want.
                      </p>
                      <p>
                        We are not going to lie, telling you that we need money
                        to develop the app further. We will use them for one
                        more beer.
                      </p>
                      <p style={{ textAlign: "center" }}>Thanks!</p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                        alignItems: "center",
                      }}
                    >
                      <form
                        action="https://www.paypal.com/donate"
                        method="post"
                        target="_blank"
                      >
                        <input
                          type="hidden"
                          name="business"
                          value="C4SUCDJG6ZG2Q"
                        />
                        <input type="hidden" name="no_recurring" value="0" />
                        <input type="hidden" name="currency_code" value="EUR" />
                        <input
                          type="image"
                          src="/ppal.png"
                          border="0"
                          name="submit"
                          title="PayPal - The safer, easier way to pay online!"
                          alt="Donate with PayPal button"
                          style={{
                            maxWidth: "200px",
                          }}
                        />
                        <img
                          alt=""
                          border="0"
                          src="https://www.paypal.com/en_US/i/scr/pixel.gif"
                          width="1"
                          height="1"
                        />
                      </form>
                      <Button
                        onClick={close}
                        size={SIZE.compact}
                        kind={KIND.tertiary}
                      >
                        <span style={{ color: "rgb(0,142,250" }}>Cancel</span>
                      </Button>
                    </div>
                    <div
                      style={{
                        fontWeight: "normal",
                        fontSize: "10pt",
                        textAlign: "left",
                        padding: "20px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "start",
                          marginBottom: "10px",
                        }}
                      >
                        <p style={{ fontSize: "18pt" }}>Download as...</p>
                        <div style={{ width: "40%", marginLeft: "25px" }}>
                          <Input
                            size={SIZE.compact}
                            value={fileName}
                            onChange={(e) => setFileName(e.target.value)}
                            placeholder="LogoCentrix"
                            clearOnEscape
                          />
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "10px",
                        }}
                      >
                        <p style={{ fontSize: "10pt", fontWeight: "bold" }}>
                          Logo design file - (sym extension)
                        </p>
                        <Button
                          onClick={exportTemplate}
                          size={SIZE.large}
                          shape={SHAPE.pill}
                          overrides={{
                            BaseButton: {
                              style: ({ $theme }) => ({
                                backgroundColor: "rgb(248,186, 66)",
                                color: "#000",
                                fontSize: "10pt",
                                paddingLeft: "15px",
                                paddingRight: "15px",
                                paddingTop: "5px",
                                paddingBottom: "5px",
                              }),
                            },
                          }}
                        >
                          Download
                        </Button>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "10px",
                        }}
                      >
                        <p style={{ fontSize: "10pt" }}>
                          Low resolution PNG image file - transparent
                          background.
                        </p>
                        <Button
                          onClick={(event) => {
                            downloadImage("png", "low", false, false);
                          }}
                          size={SIZE.large}
                          shape={SHAPE.pill}
                          overrides={{
                            BaseButton: {
                              style: ({ $theme }) => ({
                                backgroundColor: "rgb(248,186, 66)",
                                color: "#000",
                                fontSize: "10pt",
                                paddingLeft: "15px",
                                paddingRight: "15px",
                                paddingTop: "5px",
                                paddingBottom: "5px",
                              }),
                            },
                          }}
                        >
                          Download
                        </Button>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "10px",
                        }}
                      >
                        <p style={{ fontSize: "10pt" }}>
                          Low resolution PNG image file - your chosen
                          background.
                        </p>
                        <Button
                          onClick={(event) => {
                            downloadImage("png", "low", true, true);
                          }}
                          size={SIZE.large}
                          shape={SHAPE.pill}
                          overrides={{
                            BaseButton: {
                              style: ({ $theme }) => ({
                                backgroundColor: "rgb(248,186, 66)",
                                color: "#000",
                                fontSize: "10pt",
                                paddingLeft: "15px",
                                paddingRight: "15px",
                                paddingTop: "5px",
                                paddingBottom: "5px",
                              }),
                            },
                          }}
                        >
                          Download
                        </Button>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "10px",
                        }}
                      >
                        <p style={{ fontSize: "10pt" }}>
                          High resolution PNG image file - transparent
                          background.
                        </p>
                        <Button
                          onClick={(event) => {
                            downloadImage("png", "high", false, false);
                          }}
                          size={SIZE.large}
                          shape={SHAPE.pill}
                          overrides={{
                            BaseButton: {
                              style: ({ $theme }) => ({
                                backgroundColor: "rgb(248,186, 66)",
                                color: "#000",
                                fontSize: "10pt",
                                paddingLeft: "15px",
                                paddingRight: "15px",
                                paddingTop: "5px",
                                paddingBottom: "5px",
                              }),
                            },
                          }}
                        >
                          Download
                        </Button>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "10px",
                        }}
                      >
                        <p style={{ fontSize: "10pt" }}>
                          High resolution PNG image file - your chosen
                          background.
                        </p>
                        <Button
                          onClick={(event) => {
                            downloadImage("png", "high", true, true);
                          }}
                          size={SIZE.large}
                          shape={SHAPE.pill}
                          overrides={{
                            BaseButton: {
                              style: ({ $theme }) => ({
                                backgroundColor: "rgb(248,186, 66)",
                                color: "#000",
                                fontSize: "10pt",
                                paddingLeft: "15px",
                                paddingRight: "15px",
                                paddingTop: "5px",
                                paddingBottom: "5px",
                              }),
                            },
                          }}
                        >
                          Download
                        </Button>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "20px",
                        }}
                      >
                        <p style={{ fontSize: "10pt" }}>
                          SVG file - vector file.
                        </p>
                        <Button
                          onClick={(event) => {
                            downloadImage("svg");
                          }}
                          size={SIZE.large}
                          shape={SHAPE.pill}
                          overrides={{
                            BaseButton: {
                              style: ({ $theme }) => ({
                                backgroundColor: "rgb(248,186, 66)",
                                color: "#000",
                                fontSize: "10pt",
                                paddingLeft: "15px",
                                paddingRight: "15px",
                                paddingTop: "5px",
                                paddingBottom: "5px",
                              }),
                            },
                          }}
                        >
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                returnFocus
                autoFocus
              >
                <Button size={SIZE.mini} kind={KIND.tertiary}>
                  Download
                </Button>
              </StatefulPopover>
            ) : null}
            {page === "Editor" ? (
              <Button
                onClick={() => {
                  window.open("/help.html", "_blank");
                }}
                size={SIZE.mini}
                kind={KIND.tertiary}
              >
                Help
              </Button>
            ) : null}
          </div>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            {page === "Editor" ? (
              <div
                style={{
                  justifySelf: "end",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  color: "#fff",
                  fontFamily: "system-ui",
                  fontSize: "10pt",
                  marginLeft: "10px",
                  marginRight: "20px",
                }}
              >
                <Button
                  onClick={updateZoomPlus}
                  size={SIZE.mini}
                  kind={KIND.tertiary}
                >
                  <Icons.ZoomPlus size={20} />
                </Button>
                <StatefulPopover
                  content={({ close }) => (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100vw",
                        textAlign: "center",
                        background: "rgb(30,30,30)",
                        padding: "10px",
                        fontFamily: "system-ui",
                        fontWeight: "bold",
                        maxWidth: "300px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          fontSize: "12px",
                          fontWeight: 500,
                          fontFamily: "system-ui",
                        }}
                      >
                        <label> Zoom </label>
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
                          min={0.4}
                          max={10}
                          step={0.1}
                          marks={false}
                          value={zoomValue}
                          onChange={({ value }) => value && updateZoom(value)}
                        />
                      </div>
                    </div>
                  )}
                  returnFocus
                  autoFocus
                  placement="bottomRight"
                >
                  <Button size={SIZE.mini} kind={KIND.tertiary}>
                    {Math.floor(zoomValue * 100)}%
                  </Button>
                </StatefulPopover>
                <Button
                  onClick={updateZoomMinus}
                  size={SIZE.mini}
                  kind={KIND.tertiary}
                >
                  <Icons.ZoomMinus size={20} />
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </ThemeProvider>
  );
}

export default Navbar;
