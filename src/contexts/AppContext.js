import React from "react";
import { createContext, useState } from "react";
export const AppContext = createContext({
  page: null,
  setPage: () => {},
  template: null,
  setTemplate: () => {},
  isMobile: false,
  setIsMobile: () => {},
  editor: null,
  setEditor: () => {},
  activeSelection: {},
  setActiveSelection: () => {},
  activeEditingModeHandle: {},
  setActiveEditingModeHandle: () => {},
  zoom: {},
  setZoom: () => {},
  activePanel: null,
  setActivePanel: () => {},
});
export const AppProvider = ({ children }) => {
  const [page, setPage] = useState("Templates");
  const [template, setTemplate] = useState(undefined);
  const [isMobile, setIsMobile] = useState(undefined);
  const [editor, setEditor] = useState(undefined);
  const [activeSelection, setActiveSelection] = useState();
  const [activeEditingModeHandle, setActiveEditingModeHandle] = useState();
  const [zoom, setZoom] = useState();
  const [activePanel, setActivePanel] = useState("Layout");
  const context = {
    page,
    setPage,
    template,
    setTemplate,
    isMobile,
    setIsMobile,
    editor,
    setEditor,
    activeSelection,
    setActiveSelection,
    activeEditingModeHandle,
    setActiveEditingModeHandle,
    zoom,
    setZoom,
    activePanel,
    setActivePanel,
  };
  return <AppContext.Provider value={context}>{children}</AppContext.Provider>;
};
