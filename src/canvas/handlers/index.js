import CanvasHandler from "./CanvasHandler";
import LayersHandler from "./LayersHandler";
import EventsHandler from "./EventsHandler";
import TemplateHandler from "./TemplateHandler";
import SymmetryHandler from "./SymmetryHandler";
import FontHandler from "./FontHandler";
import HistoryHandler from "./HistoryHandler";

class Handlers {
  constructor(props) {
    this.canvas = props.canvas;
    const handlerOptions = {
      handlers: this,
      canvas: props.canvas,
      editor: props.editor,
      context: props.context,
    };
    this.canvasHandler = new CanvasHandler(handlerOptions);
    this.layersHandler = new LayersHandler(handlerOptions);
    this.templateHandler = new TemplateHandler(handlerOptions);
    this.eventsHandler = new EventsHandler(handlerOptions);
    this.symmetryHandler = new SymmetryHandler(handlerOptions);
    this.fontHandler = new FontHandler(handlerOptions);
    this.historyHandler = new HistoryHandler(handlerOptions);
  }
}
export default Handlers;
