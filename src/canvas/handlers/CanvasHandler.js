import BaseHandler from "./BaseHandler";
class CanvasHandler extends BaseHandler {
  constructor(props) {
    super(props);
    this.options = {
      width: props.canvas.width,
      height: props.canvas.height,
    };
  }
  resize(nextWidth, nextHeight) {
    this.options.width = nextWidth;
    this.options.height = nextHeight;
    //let oldCenter = new this.canvas.Point(this.canvas.view.center);
    this.canvas.view.setViewSize(new this.canvas.Size(nextWidth, nextHeight));
    // let newCenter = new this.canvas.Point(this.canvas.view.center);
    //let delta = newCenter.subtract(oldCenter);
    //this.canvas.view.translate(delta);
    this.fitBounds();
  }
  fitBounds() {
    let viewBounds = this.canvas.view.bounds;
    let layerBounds = this.canvas.project.activeLayer.bounds;
    if (layerBounds.width > 0) {
      let scaleRatio = Math.min(
        viewBounds.width / (layerBounds.width * 1.2),
        viewBounds.height / (layerBounds.height * 1.2)
      );
      this.canvas.view.translate(
        viewBounds.center.subtract(layerBounds.center)
      );
      this.canvas.view.scale(scaleRatio);
    }
    this.handlers.eventsHandler.removeSelection();
    this.handlers.layersHandler.drawBackground();
  }
}
export default CanvasHandler;
