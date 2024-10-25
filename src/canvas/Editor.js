// import paper from "./paper/paper-core.js";
import paper from "./paper/paper-core";
import Handlers from "./handlers";
import EventManager from "./EventManager";
import CanvasController from "./controllers/CanvasController";
class Editor extends EventManager {
  constructor(props) {
    super(props);
    this.context = props.context;
    paper.setup(props.canvasRef);
    this.handlers = new Handlers(
      Object.assign(Object.assign({ canvas: paper }, props), {
        editor: this,
      })
    );
    this.canvas = new CanvasController(this.handlers.canvasHandler);
    if (props.template) {
      this.importTemplate(props.template);
    }
    this.handlers.layersHandler.setBackgroundFill("#fff");
  }
  addShape(shape) {
    let sides = 1;
    this.discardActiveSelection();
    let firstSymmetryMatch =
      this.handlers.canvas.project.activeLayer.children.find(
        (children) => children.symmetryIndex !== undefined
      );
    let bounds = {
      center: firstSymmetryMatch
        ? firstSymmetryMatch.symmetryCenter
        : this.handlers.canvas.view.center,
      size: firstSymmetryMatch
        ? firstSymmetryMatch.strokeBounds.size.width / 4
        : 15,
      position: firstSymmetryMatch
        ? firstSymmetryMatch.strokeBounds.center
        : this.handlers.canvas.view.center,
      sides: firstSymmetryMatch ? firstSymmetryMatch.amount : sides,
    };
    switch (shape) {
      case "circle":
        this.handlers.symmetryHandler.addSymmetry(
          new this.handlers.canvas.Path.Circle({
            center: bounds.position,
            radius: bounds.size,
            strokeWidth: 3,
            strokeColor: "black",
            fillColor: "rgba(0,0,0,0.001)",
          }),
          bounds.sides,
          bounds.center
        );
        break;
      case "line":
        this.handlers.symmetryHandler.addSymmetry(
          new this.handlers.canvas.Path.Line({
            from: bounds.position,
            to: bounds.position.add(
              new this.handlers.canvas.Point(bounds.size * 2, 0)
            ),
            strokeWidth: 3,
            strokeColor: "black",
            fillColor: "rgba(0,0,0,0.001)",
          }),
          bounds.sides,
          bounds.center,
          false
        );
        break;
      case "rectangle":
        this.handlers.symmetryHandler.addSymmetry(
          new this.handlers.canvas.Path.RegularPolygon({
            center: bounds.position,
            sides: 4,
            radius: bounds.size,
            strokeWidth: 3,
            strokeColor: "black",
            fillColor: "rgba(0,0,0,0.001)",
          }),
          bounds.sides,
          bounds.center
        );

        break;
      case "triangle":
        this.handlers.symmetryHandler.addSymmetry(
          new this.handlers.canvas.Path.RegularPolygon({
            center: bounds.position,
            sides: 3,
            radius: bounds.size,
            strokeWidth: 3,
            strokeColor: "black",
            fillColor: "rgba(0,0,0,0.001)",
          }),
          bounds.sides,
          bounds.center
        );

        break;
      case "rhombus":
        this.handlers.symmetryHandler.addSymmetry(
          new this.handlers.canvas.Path.RegularPolygon({
            center: bounds.position,
            sides: 4,
            radius: bounds.size,
            rotation: 45,
            strokeWidth: 3,
            strokeColor: "black",
            fillColor: "rgba(0,0,0,0.001)",
          }),
          bounds.sides,
          bounds.center
        );

        break;
      case "pentagon":
        this.handlers.symmetryHandler.addSymmetry(
          new this.handlers.canvas.Path.RegularPolygon({
            center: bounds.position,
            sides: 5,
            radius: bounds.size,
            strokeWidth: 3,
            strokeColor: "black",
            fillColor: "rgba(0,0,0,0.001)",
          }),
          bounds.sides,
          bounds.center
        );

        break;
      case "hexagon":
        this.handlers.symmetryHandler.addSymmetry(
          new this.handlers.canvas.Path.RegularPolygon({
            center: bounds.position,
            sides: 6,
            radius: bounds.size,
            strokeWidth: 3,
            strokeColor: "black",
            fillColor: "rgba(0,0,0,0.001)",
          }),
          bounds.sides,
          bounds.center
        );

        break;
    }
    this.handlers.historyHandler.snapshot();
  }
  update(options) {
    let activeSelection =
      this.handlers.eventsHandler.selectionTool.activeSelection;
    if (activeSelection && activeSelection.item) {
      activeSelection.item.set(options);
      if (typeof activeSelection.item.computeLayout === "function") {
        activeSelection.item.computeLayout();
      }
      this.handlers.symmetryHandler.updateSymmetry(activeSelection.item);
      activeSelection.updateHandles();
      this.handlers.historyHandler.snapshot();
    }
  }
  enterEditingMode() {
    this.handlers.eventsHandler.enterEditingMode();
  }
  exitEditingMode() {
    this.handlers.eventsHandler.exitEditingMode();
  }
  setEditingAction(action) {
    this.handlers.eventsHandler.setEditingAction(action);
    //this.handlers.historyHandler.snapshot();
  }
  getZoom() {
    return this.handlers.canvas.view.zoom;
  }
  setZoom(value) {
    this.handlers.canvas.view.zoom = value;
    this.handlers.layersHandler.drawBackground();
    let activeSelection =
      this.handlers.eventsHandler.selectionTool.activeSelection;
    if (activeSelection && activeSelection.item) {
      activeSelection.updateHandles(true);
    }
  }
  getEditingModeAction() {
    return (
      this.handlers.eventsHandler.selectionTool.activeSelection &&
      this.handlers.eventsHandler.selectionTool.activeSelection
        .editingModeAction
    );
  }
  setActiveSelection(item) {
    this.handlers.eventsHandler.setActiveSelection(item);
  }
  activeSelection() {
    return this.handlers.eventsHandler.selectionTool.activeSelection;
  }
  discardActiveSelection() {
    this.handlers.eventsHandler.removeSelection();
  }
  removeActiveSelection() {
    let item =
      this.handlers.eventsHandler.selectionTool.activeSelection &&
      this.handlers.eventsHandler.selectionTool.activeSelection.item;
    this.handlers.eventsHandler.removeItem();
    if (
      item &&
      !isNaN(item.symmetryIndex) &&
      this.handlers.symmetryHandler.symmetries[item.symmetryIndex]
    ) {
      this.handlers.symmetryHandler.symmetries[item.symmetryIndex].forEach(
        (element) => {
          element.remove();
        }
      );
      this.handlers.symmetryHandler.symmetries[item.symmetryIndex] = [];
    }
    this.handlers.historyHandler.snapshot();
  }
  setFlipOption(flag) {
    let activeSelection =
      this.handlers.eventsHandler.selectionTool.activeSelection;
    if (activeSelection && activeSelection.item) {
      this.handlers.symmetryHandler.setFlipOn(activeSelection.item, flag);
    }
    activeSelection.updateHandles();
    this.handlers.historyHandler.snapshot();
  }
  bringToFront() {
    let activeSelection =
      this.handlers.eventsHandler.selectionTool.activeSelection;
    if (activeSelection && activeSelection.item) {
      activeSelection.group.bringToFront();
    }
  }
  sendToBack() {
    let activeSelection =
      this.handlers.eventsHandler.selectionTool.activeSelection;
    if (activeSelection && activeSelection.item) {
      activeSelection.group.sendToBack();
    }
  }
  isEditing() {
    return (
      this.handlers.eventsHandler.selectionTool.activeSelection &&
      this.handlers.eventsHandler.selectionTool.activeSelection.editingMode
    );
  }
  isEditingWithHandle() {
    return (
      this.handlers.eventsHandler.selectionTool.activeSelection &&
      this.handlers.eventsHandler.selectionTool.activeSelection.editingMode &&
      this.handlers.eventsHandler.selectionTool.activeSelection.handle
    );
  }
  setGrid(value) {
    this.handlers.layersHandler.setGrid(value);
  }
  setSnap(value) {
    this.handlers.layersHandler.setSnap(value);
  }
  setBackgroundFill(value) {
    this.handlers.layersHandler.setBackgroundFill(value);
  }
  setSymmetrySides(value) {
    let activeSelection =
      this.handlers.eventsHandler.selectionTool.activeSelection;
    if (activeSelection && activeSelection.item) {
      this.handlers.symmetryHandler.setSymmetrySides(
        activeSelection.item,
        value
      );
    }
  }
  setSymmetryMirror(value) {
    let activeSelection =
      this.handlers.eventsHandler.selectionTool.activeSelection;
    if (activeSelection && activeSelection.item) {
      this.handlers.symmetryHandler.setSymmetryMirror(
        activeSelection.item,
        value
      );
    }
  }
  alignLogo(position) {
    this.selectAllShapes();
    let firstTextMatch = this.handlers.canvas.project.activeLayer.children.find(
      (children) => children._class === "PathText"
    );
    let activeSelection =
      this.handlers.eventsHandler.selectionTool.activeSelection;
    if (activeSelection && activeSelection.group && firstTextMatch) {
      switch (position) {
        case "top":
          firstTextMatch.position =
            activeSelection.group.strokeBounds.bottomCenter.add(
              new this.handlers.canvas.Point(0, firstTextMatch.bounds.height)
            );
          break;
        case "bottom":
          firstTextMatch.position =
            activeSelection.group.strokeBounds.topCenter.subtract(
              new this.handlers.canvas.Point(0, firstTextMatch.bounds.height)
            );
          break;
        case "left":
          firstTextMatch.position =
            activeSelection.group.strokeBounds.rightCenter.add(
              new this.handlers.canvas.Point(firstTextMatch.bounds.width, 0)
            );
          break;
        case "right":
          firstTextMatch.position =
            activeSelection.group.strokeBounds.leftCenter.subtract(
              new this.handlers.canvas.Point(firstTextMatch.bounds.width, 0)
            );
          break;
      }
    }
    this.fitToScreen();
    //this.handlers.canvasHandler.fitBounds();
  }
  selectFirstElementByType(type) {
    switch (type) {
      case "Text":
        this.setActiveSelection(
          this.handlers.canvas.project.activeLayer.children.find(
            (children) => children._class === "PathText"
          )
        );
        break;
      case "Layout":
        this.setActiveSelection(
          this.handlers.canvas.project.activeLayer.children.filter(
            (children) => children._class !== "PathText"
          )
        );
        break;
      case "Symmetry":
        this.setActiveSelection(
          this.handlers.canvas.project.activeLayer.children.find(
            (children) => children.symmetryIndex !== undefined
          )
        );
        break;
    }
  }
  selectAllShapes() {
    this.discardActiveSelection();
    this.setActiveSelection(
      this.handlers.canvas.project.activeLayer.children.filter(
        (children) => children._class !== "PathText"
      )
    );
  }
  fitToScreen() {
    this.handlers.canvasHandler.fitBounds();
    this.context.setZoom(this.handlers.canvas.view.zoom);
  }
  loadFont(fontFamily, callback) {
    this.handlers.fontHandler.loadFont(fontFamily, callback);
  }
  addText() {
    this.discardActiveSelection();
    let elements = this.handlers.canvas.project.activeLayer.children;
    let textMatch = elements
      .map((item, index) => elements[elements.length - 1 - index])
      .find((children) => children._class === "PathText");
    //let textMatch = this.handlers.canvas.project.activeLayer.children.find(
    //    (children) => children._class === "PathText"
    //  );
    let text = new this.handlers.canvas.PathText({
      point: this.handlers.canvas.project.activeLayer.bounds.bottomCenter.add(
        new this.handlers.canvas.Point(0, 50)
      ),
      justification: "center",
      content: "Your logo name",
      fillColor: textMatch ? textMatch.fillColor : "black",
      strokeColor: textMatch ? textMatch.strokeColor : "black",
      fontFamily: "Roboto-Regular",
      fontSize: 30,
    });
    // temp solution for clone
    if (textMatch) {
      text.set({
        justification: textMatch.justification,
        content: textMatch.content,
        strokeWidth: textMatch.strokeWidth,
        fontFamily: textMatch.fontFamily,
        fontSize: textMatch.fontSize,
        matrix: textMatch.matrix,
      });
      text.position = textMatch.position.add(
        new this.handlers.canvas.Point(0, textMatch.bounds.height * 1.5)
      );
    }
    this.fitToScreen();
    this.setActiveSelection(text);
  }
  undo() {
    this.handlers.historyHandler.undo();
  }
  redo() {
    this.handlers.historyHandler.redo();
  }
  exportPng(resolution, background) {
    this.handlers.eventsHandler.removeSelection();
    // add background
    let bg = background
      ? this.handlers.canvas.project.activeLayer.insertChild(
        0,
        new this.handlers.canvas.Path.Rectangle({
          point:
            this.handlers.canvas.project.activeLayer.strokeBounds.topLeft,
          size: this.handlers.canvas.project.activeLayer.strokeBounds.size,
          fillColor: this.handlers.layersHandler.backgroundFill,
          locked: true,
        })
      )
      : false;
    let raster = this.handlers.canvas.project.activeLayer.rasterize({
      resolution: resolution,
      insert: false,
    });
    let image = raster.toDataURL();
    if (bg) bg.remove();
    return image;
    //console.log(raster);
  }
  exportSvg() {
    this.handlers.eventsHandler.removeSelection();
    let bounds = this.handlers.canvas.project.activeLayer.strokeBounds;
    let padding = Math.max(bounds.width, bounds.height) * 0.1;
    console.log(bounds);
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="${bounds.topLeft.x - padding
      },${bounds.topLeft.y - padding},${bounds.width + padding * 2},${bounds.height + padding * 2
      }">
     ${this.handlers.canvas.project.activeLayer.exportSVG({
        asString: true,
      })}
     </svg>`;
    return svg;
  }
  importTemplate(template) {
    this.handlers.templateHandler.importTemplate(template);
    this.handlers.canvas.view._needsUpdate = true;
    this.handlers.canvas.view.requestUpdate();
    this.handlers.historyHandler._undo = [];
    this.handlers.historyHandler._redo = [];
    this.handlers.historyHandler.snapshot();
    this.fitToScreen();
  }
  exportTemplate() {
    return this.handlers.templateHandler.exportTemplate();
  }
  destroy() { }
}
export default Editor;
