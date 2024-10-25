class BaseHandler {
  constructor({ canvas, handlers, context, config, editor }) {
    this.canvas = canvas;
    this.handlers = handlers;
    this.context = context;
    this.config = config;
    this.editor = editor;
  }
}
export default BaseHandler;
