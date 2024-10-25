import BaseHandler from "./BaseHandler";
class HistoryHandler extends BaseHandler {
  constructor(props) {
    super(props);
    this._undo = [];
    this._redo = [];
    this.historyNextState = null;
  }
  next() {
    let activeSelection =
      this.handlers.eventsHandler.selectionTool.activeSelection;
    let isEditing = activeSelection && activeSelection.editingMode;
    let segmentIndex = activeSelection && activeSelection.segmentIndex;
    let curveIndex = activeSelection && activeSelection.curveIndex;
    let handle = activeSelection && activeSelection.handle;
    let template = this.handlers.templateHandler.exportTemplate();
    if (activeSelection) {
      this.handlers.eventsHandler.setActiveSelection(activeSelection.item);
      if (isEditing) {
        this.handlers.eventsHandler.enterEditingMode();
        let newSelection =
          this.handlers.eventsHandler.selectionTool.activeSelection;
        newSelection.segmentIndex = segmentIndex;
        newSelection.curveIndex = curveIndex;
        newSelection.handle = handle;
        this.handlers.eventsHandler.updateHandles();
      }
    }
    return template;
  }
  snapshot() {
    if (this.historyNextState) {
      const json = this.historyNextState;
      this._undo.push(json);
      this._redo = [];
    }
    this.historyNextState = this.next();
  }
  undo() {
    const history = this._undo.pop();
    if (history) {
      this._redo.push(this.next());
      this.historyNextState = history;
      this.load(history);
    }
  }
  redo() {
    const history = this._redo.pop();
    if (history) {
      this._undo.push(this.next());
      this.historyNextState = history;
      this.load(history);
    }
  }
  load(history) {
    this.handlers.templateHandler.importTemplate(JSON.parse(history));
  }
}
export default HistoryHandler;
