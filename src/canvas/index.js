import React, { useEffect, useContext, useRef } from "react";
import Editor from "./Editor";
import useAppContext from "../hooks/useAppContext";
import { AppContext } from "../contexts/AppContext";
function Canvas() {
  const containerRef = useRef();
  const canvasRef = useRef();
  const { template, setEditor } = useAppContext();
  const context = useContext(AppContext);
  useEffect(() => {
    const container = containerRef.current;
    const { clientHeight, clientWidth } = container;
    const editor = new Editor({
      canvasRef: canvasRef.current,
      context: context,
      template: template,
    });
    setEditor(editor);
    editor.canvas.resize(container.clientWidth, container.clientHeight);
    const resizeObserver = new ResizeObserver((entries) => {
      const { width = clientWidth, height = clientHeight } =
        (entries[0] && entries[0].contentRect) || {};
      editor.canvas.resize(width, height);
    });
    resizeObserver.observe(container);
    return () => {
      editor.destroy();
      if (container) {
        resizeObserver.unobserve(container);
      }
    };
    // eslint-disable-next-line
  }, []);
  return (
    <div
      id="editor-container"
      ref={containerRef}
      style={{ flex: 1, position: "relative", overflow: "hidden" }}
    >
      <div
        style={{
          position: "absolute",
          height: "100%",
          width: "100%",
        }}
      >
        <canvas id="canvas" ref={canvasRef}></canvas>
      </div>
    </div>
  );
}
export default Canvas;
