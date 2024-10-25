class EventManager {
  constructor() {
    this.all = new Map();
  }
  on(type, handler) {
    const handlers = this.all.get(type);
    if (handlers) {
      handlers.push(handler);
    } else {
      this.all.set(type, [handler]);
    }
  }
  off(type, handler) {
    const handlers = this.all.get(type);
    if (handlers) {
      if (handler) {
        handlers.splice(handlers.indexOf(handler) >>> 0, 1);
      } else {
        this.all.set(type, []);
      }
    }
  }
  emit(type, evt) {
    let handlers = this.all.get(type);
    if (handlers) {
      handlers.slice().map((handler) => {
        handler(evt);
        return handler;
      });
    }
    handlers = this.all.get("*");
    if (handlers) {
      handlers.slice().map((handler) => {
        handler(type, evt);
        return handler;
      });
    }
  }
}
export default EventManager;
