import { AppContext } from "../contexts/AppContext";
import { useContext } from "react";

function useAppContext() {
  const { page, setPage } = useContext(AppContext);
  const { template, setTemplate } = useContext(AppContext);
  const { isMobile, setIsMobile } = useContext(AppContext);
  const { editor, setEditor } = useContext(AppContext);
  const { activeSelection, setActiveSelection } = useContext(AppContext);
  const { activeEditingModeHandle, setActiveEditingModeHandle } =
    useContext(AppContext);
  const { zoom, setZoom } = useContext(AppContext);
  const { activePanel, setActivePanel } = useContext(AppContext);
  return {
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
}

export default useAppContext;
