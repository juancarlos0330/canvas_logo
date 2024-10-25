import BaseHandler from "./BaseHandler";
class TemplateHandler extends BaseHandler {
  constructor(props) {
    super(props);
  }
  importTemplate(template) {
    template = template || {
      symmetries: [],
      elements: [],
      background: "#ffffff",
    };
    this.handlers.eventsHandler.removeSelection();
    this.handlers.canvas.project.activeLayer.removeChildren();
    this.handlers.symmetryHandler.symmetries = [];
    template.symmetries.forEach((symmetry) => {
      this.handlers.symmetryHandler.addSymmetry(
        this.handlers.canvas.project.activeLayer.importJSON(symmetry.element),
        symmetry.amount,
        symmetry.center &&
          new this.handlers.canvas.Point(symmetry.center.x, symmetry.center.y)
      );
    });
    template.elements.forEach((element) => {
      let paperElement =
        this.handlers.canvas.project.activeLayer.importJSON(element);
      // load fonts
      if (paperElement._class === "PathText") {
        this.handlers.fontHandler.loadFont(
          paperElement._style.fontFamily,
          () => {
            paperElement.computeLayout();
          }
        );
      }
    });
    this.handlers.layersHandler.setBackgroundFill(template.background);
    //this.handlers.canvasHandler.fitBounds();
  }
  exportTemplate() {
    this.handlers.eventsHandler.removeSelection();
    let template = {
      symmetries: this.handlers.symmetryHandler.exportSymmetry(),
      elements: [],
      background: this.handlers.layersHandler.backgroundFill,
    };
    let elements = this.handlers.canvas.project.activeLayer.children.filter(
      (children) => !children.excludeFromExport
    );
    elements.forEach((element) => {
      template.elements.push(element.exportJSON());
    });
    return JSON.stringify(template);
  }
}
export default TemplateHandler;
