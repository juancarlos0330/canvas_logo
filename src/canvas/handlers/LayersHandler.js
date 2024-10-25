import BaseHandler from "./BaseHandler";
class LayersHandler extends BaseHandler {
  constructor(props) {
    super(props);
    this.backgroundLayer = new this.handlers.canvas.Layer();
    this.drawingLayer = new this.handlers.canvas.Layer();
    this.drawingLayer.activate();
    this.backgroundFill = "#ffffff";
    this.grid = true;
    this.gridSize = 10;
    this.drawBackground();
  }
  setGrid(value) {
    this.grid = value;
    this.drawBackground();
  }
  setBackgroundFill(color) {
    this.backgroundFill = color;
    this.drawBackground();
  }
  drawBackground() {
    this.backgroundLayer.removeChildren();
    // fill background
    this.backgroundLayer.addChild(
      new this.handlers.canvas.Path.Rectangle({
        point: this.handlers.canvas.view.bounds.topLeft,
        size: this.handlers.canvas.view.bounds.size,
        fillColor: this.backgroundFill,
        locked: true,
      })
    );
    if (!this.grid) return;
    // draw grid
    //console.log(this.gridSize * this.handlers.canvas.view.zoom);
    let verticalLine = new this.handlers.canvas.SymbolDefinition(
      this.backgroundLayer.addChild(
        new this.handlers.canvas.Path.Line({
          from: [0, this.handlers.canvas.view.bounds.topLeft.y],
          to: [
            0,
            this.handlers.canvas.view.bounds.topLeft.y +
              this.handlers.canvas.view.bounds.size.height,
          ],
          strokeColor: "#DFDFDF",
          strokeWidth: 1 / this.handlers.canvas.view.zoom,
          locked: true,
        })
      )
    );
    let horizontalLine = new this.handlers.canvas.SymbolDefinition(
      this.backgroundLayer.addChild(
        new this.handlers.canvas.Path.Line({
          from: [0, this.handlers.canvas.view.bounds.topLeft.y],
          to: [
            0,
            this.handlers.canvas.view.bounds.topLeft.y +
              this.handlers.canvas.view.bounds.size.height,
          ],
          strokeColor: "#DFDFDF",
          strokeWidth: 1 / this.handlers.canvas.view.zoom,
          locked: true,
        })
      )
    );
    for (
      let w =
        -this.gridSize -
        (this.handlers.canvas.view.bounds.topLeft.x % this.gridSize);
      w < this.handlers.canvas.view.bounds.size.width + this.gridSize;
      w += this.gridSize
    ) {
      this.backgroundLayer.addChild(
        verticalLine.place(
          new this.handlers.canvas.Point(
            this.handlers.canvas.view.bounds.topLeft.x + w,
            this.handlers.canvas.view.bounds.center.y
          )
        )
      );
      /*
      this.backgroundLayer.addChild(
        new this.handlers.canvas.Path.Line({
          from: [
            this.handlers.canvas.view.bounds.topLeft.x + w,
            this.handlers.canvas.view.bounds.topLeft.y,
          ],
          to: [
            this.handlers.canvas.view.bounds.topLeft.x + w,
            this.handlers.canvas.view.bounds.topLeft.y +
              this.handlers.canvas.view.bounds.size.height,
          ],
          strokeColor: "#DFDFDF",
          strokeWidth: 1 / this.handlers.canvas.view.zoom,
          locked: true,
        })
      );
      */
    }
    // y axis
    for (
      let h =
        -this.gridSize -
        (this.handlers.canvas.view.bounds.topLeft.y % this.gridSize);
      h < this.handlers.canvas.view.bounds.size.height + this.gridSize;
      h += this.gridSize
    ) {
      this.backgroundLayer.addChild(
        new this.handlers.canvas.Path.Line({
          from: [
            this.handlers.canvas.view.bounds.topLeft.x,
            this.handlers.canvas.view.bounds.topLeft.y + h,
          ],
          to: [
            this.handlers.canvas.view.bounds.topLeft.x +
              this.handlers.canvas.view.bounds.size.width,
            this.handlers.canvas.view.bounds.topLeft.y + h,
          ],
          strokeColor: "#DFDFDF",
          strokeWidth: 1 / this.handlers.canvas.view.zoom,
          locked: true,
        })
      );
    }
  }
}
export default LayersHandler;
