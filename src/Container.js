import React from "react";
import { useEffect, useRef } from "react";
import useAppContext from "./hooks/useAppContext";

function Container({ children }) {
  const containerRef = useRef();
  const { isMobile, setIsMobile } = useAppContext();
  const updateMediaQuery = (value) => {
    if (!isMobile && value >= 800) {
      setIsMobile(false);
    } else if (!isMobile && value < 800) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };
  useEffect(() => {
    const containerElement = containerRef.current;
    const containerWidth = containerElement.clientWidth;
    updateMediaQuery(containerWidth);
    const resizeObserver = new ResizeObserver((entries) => {
      const { width = containerWidth } =
        (entries[0] && entries[0].contentRect) || {};
      updateMediaQuery(width);
    });
    resizeObserver.observe(containerElement);
    return () => {
      if (containerElement) {
        resizeObserver.unobserve(containerElement);
      }
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        flex: 1,
        display: "flex",
        height: "100vh",
        width: "100vw",
      }}
    >
      {children}
    </div>
  );
}

export default Container;
