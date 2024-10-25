class CanvasController {
  constructor(handler) {
    this.handler = handler;
  }
  resize(nextWidth, nextHeight) {
    this.handler.resize(nextWidth, nextHeight);
  }
}
export default CanvasController;
