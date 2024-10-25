import BaseHandler from "./BaseHandler";
class Transformer {
  constructor(props) {
    this.canvas = props.canvas;
    //this.group = new this.canvas.Group(...props.item);
    this.item = props.item[0];
    this.group = this.canvas.project.activeLayer.insertChild(
      this.item.index,
      new this.canvas.Group(...props.item)
    );
    //this.group.fullySelected = true;
    //this.group.applyMatrix = false;
    this.symmetryHandler = props.symmetryHandler;
    this.handle = props.handle;
    this.editingMode = false;
    this.handleSize = 15;
    this.initHandles();
    this.updateHandles();
  }
  initHandles() {
    if (this.handles) this.remove(false);
    this.handles = {
      bounds: new this.canvas.Path.Rectangle({
        excludeFromExport: true,
        from: new this.canvas.Point(0, 0),
        to: new this.canvas.Point(100, 100),
        strokeWidth: 1 / this.canvas.view.zoom,
        strokeColor: "rgb(27, 141, 245)",
        fillColor: "rgba(0,0,0,0.001)",
        handle: "bounds",
      }),
      topLeft: new this.canvas.Path.Rectangle({
        excludeFromExport: true,
        point: new this.canvas.Point(0, 0),
        size: [
          this.handleSize / this.canvas.view.zoom,
          this.handleSize / this.canvas.view.zoom,
        ],
        fillColor: "rgb(27, 141, 245)",
        handle: "topLeft",
      }),
      topRight: new this.canvas.Path.Rectangle({
        excludeFromExport: true,
        point: new this.canvas.Point(0, 0),
        size: [
          this.handleSize / this.canvas.view.zoom,
          this.handleSize / this.canvas.view.zoom,
        ],
        fillColor: "rgb(27, 141, 245)",
        handle: "topRight",
      }),
      bottomLeft: new this.canvas.Path.Rectangle({
        excludeFromExport: true,
        point: new this.canvas.Point(0, 0),
        size: [
          this.handleSize / this.canvas.view.zoom,
          this.handleSize / this.canvas.view.zoom,
        ],
        fillColor: "rgb(27, 141, 245)",
        handle: "bottomLeft",
      }),
      bottomRight: new this.canvas.Path.Rectangle({
        excludeFromExport: true,
        point: new this.canvas.Point(0, 0),
        size: [
          this.handleSize / this.canvas.view.zoom,
          this.handleSize / this.canvas.view.zoom,
        ],
        fillColor: "rgb(27, 141, 245)",
        handle: "bottomRight",
      }),
      middleTopOffset: new this.canvas.Path.Line({
        excludeFromExport: true,
        from: new this.canvas.Point(0, 0),
        to: new this.canvas.Point(0, 30 / this.canvas.view.zoom),
        strokeWidth: 1 / this.canvas.view.zoom,
        strokeColor: "rgb(27, 141, 245)",
        handle: "none",
      }),
      middleTop: new this.canvas.Path({
        excludeFromExport: true,
        pathData: `M202.403,95.22c0,46.312-33.237,85.002-77.109,93.484v25.663l-69.76-40l69.76-40v23.494
          c27.176-7.87,47.109-32.964,47.109-62.642c0-35.962-29.258-65.22-65.22-65.22s-65.22,29.258-65.22,65.22
          c0,9.686,2.068,19.001,6.148,27.688l-27.154,12.754c-5.968-12.707-8.994-26.313-8.994-40.441C11.964,42.716,54.68,0,107.184,0
          S202.403,42.716,202.403,95.22z`,
        position: new this.canvas.Point(0, 0),
        fillColor: "rgb(27, 141, 245)",
        handle: "middleTop",
      }),
      segments: [],
      curves: [],
    };
    this.handles.middleTop.scale(
      20 / this.handles.middleTop.bounds.size.width / this.canvas.view.zoom
    );
    this.handles.middleTop.rotate(180);
  }
  updateHandles(init, rotationAction, position) {
    // update strokeWidth and size when zoom
    if (init) this.initHandles();
    this.handles.bounds.bounds = this.group.strokeBounds;
    this.handles.bottomLeft.position = this.handles.bounds.segments[0].point;
    this.handles.topLeft.position = this.handles.bounds.segments[1].point;
    this.handles.topRight.position = this.handles.bounds.segments[2].point;
    this.handles.bottomRight.position = this.handles.bounds.segments[3].point;
    this.handles.middleTopOffset.position =
      this.handles.bounds.bounds.topCenter.subtract(
        new this.canvas.Point(0, 15 / this.canvas.view.zoom)
      );
    /* we hide handles if rotation action and update middleTop handle to mouse position
     in order to get correct rotation angle */
    if (rotationAction && position) {
      this.handles.middleTop.position =
        this.handles.middleTop.position.add(position);
    } else {
      this.handles.middleTop.position =
        this.handles.bounds.bounds.topCenter.subtract(
          new this.canvas.Point(0, 40 / this.canvas.view.zoom)
        );
    }
    this.updateVisibility(rotationAction);
    this.updateSegmentHandles();
  }
  updateVisibility(shouldHide) {
    let visible = shouldHide ? false : !this.editingMode;
    this.handles.bounds.visible = visible;
    this.handles.topLeft.visible = visible;
    this.handles.topRight.visible = visible;
    this.handles.bottomLeft.visible = visible;
    this.handles.bottomRight.visible = visible;
    this.handles.middleTop.visible = visible;
    this.handles.middleTopOffset.visible = visible;
  }
  getBezierPos(curve) {
    if (!curve || !curve.bezier) return new this.canvas.Point(0, 0);
    let segment = curve.segment2;
    let next = curve.segment1;
    let segmentVector = next.point.subtract(segment.point);
    let segmentOffsetVector = segmentVector.multiply(
      curve.bezier.percentage / 100
    );
    let distanceVector = new this.canvas.Point(0, curve.bezier.distance);
    distanceVector.angle =
      segmentVector.angle + (curve.bezier.distance > 0 ? -90 : 90);
    let position = distanceVector.add(
      new this.canvas.Point(segmentOffsetVector.x, segmentOffsetVector.y)
    );
    return position;
  }
  updateBezier(position, curve) {
    let curvePosition = position;
    let start = curve.segment2.point;
    let end = curve.segment1.point;

    let calcDist = (p, a, b) => {
      let atob = {
        x: b.x - a.x,
        y: b.y - a.y,
      };
      let atop = {
        x: p.x - a.x,
        y: p.y - a.y,
      };
      let len = atob.x * atob.x + atob.y * atob.y;
      let dot = atop.x * atob.x + atop.y * atob.y;
      let t = dot / len;
      dot = (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x);
      return {
        point: {
          x: a.x + atob.x * t,
          y: a.y + atob.y * t,
        },
        left: dot < 1,
        dot: dot,
        t: t,
      };
    };
    let distance = calcDist(curvePosition, start, end).t;
    let vectys = end.subtract(start).multiply(distance);
    curve.bezier = {
      distance:
        end
          .subtract(start)
          .getDirectedAngle(curvePosition.subtract(start.add(vectys))) < 0
          ? curvePosition.subtract(start.add(vectys)).length
          : -curvePosition.subtract(start.add(vectys)).length,
      percentage: distance * 100,
    };
    let distancePoint = start.add(this.getBezierPos(curve));
    let cpX = 2 * distancePoint.x - start.x / 2 - end.x / 2;
    let cpY = 2 * distancePoint.y - start.y / 2 - end.y / 2;
    curve.segment1.handleOut = new this.canvas.Point(cpX, cpY)
      .subtract(end)
      .divide(1.5);
    curve.segment2.handleIn = new this.canvas.Point(cpX, cpY)
      .subtract(start)
      .divide(1.5);
  }
  initSegmentHandles() {
    this.removeSegmentHandles();
    this.item.curves.forEach((curve, index) => {
      if (!curve.bezier) {
        curve.bezier = {
          distance: 0,
          percentage: 50,
        };
      }
      this.handles.curves.push(
        new this.canvas.Path.Circle({
          excludeFromExport: true,
          center: curve.getLocationAtTime(0.5).point,
          radius: this.handleSize / 2 / this.canvas.view.zoom,
          strokeWidth: 1 / this.canvas.view.zoom,
          strokeColor: "rgb(255, 126, 121)",
          fillColor: "rgb(255, 255, 255)",
          handle: "curve",
          curveIndex: index,
        })
      );
    });
    this.item.segments.forEach((segment, index) => {
      this.handles.segments.push(
        new this.canvas.Path.Circle({
          excludeFromExport: true,
          center: segment.point,
          radius: this.handleSize / 1.5 / this.canvas.view.zoom,
          strokeWidth: 1 / this.canvas.view.zoom,
          strokeColor: "rgb(27, 141, 245)",
          fillColor: "rgb(255, 255, 255)",
          handle: "segment",
          segmentIndex: index,
        })
      );
    });
  }
  removeSegmentHandles() {
    this.handles.segments.forEach((segment) => {
      segment.remove();
    });
    this.handles.curves.forEach((curve) => {
      curve.remove();
    });
    this.handles.segments = [];
    this.handles.curves = [];
  }
  updateSegmentHandles() {
    // check if we miss segment handles
    if (!this.item.segments) return;
    if (
      (this.editingMode &&
        this.handles.segments.length < this.item.segments.length) ||
      this.handles.segments.length > this.item.segments.length
    ) {
      this.initSegmentHandles();
    }
    if (
      (this.editingMode &&
        this.handles.curves.length < this.item.curves.length) ||
      this.handles.curves.length > this.item.curves.length
    ) {
      this.initSegmentHandles();
    }
    // remove handles if not in editing mode
    if (!this.editingMode && this.handles.segments.length > 0) {
      this.removeSegmentHandles();
    } else if (this.editingMode) {
      // update position
      this.item.segments.forEach((segment, index) => {
        if (this.handle && this.segmentIndex === index) {
          this.handles.segments[index].fillColor.red = 0.105;
          this.handles.segments[index].fillColor.green = 0.552;
          this.handles.segments[index].fillColor.blue = 0.96;
        } else {
          this.handles.segments[index].fillColor.red = 1;
          this.handles.segments[index].fillColor.green = 1;
          this.handles.segments[index].fillColor.blue = 1;
        }
        this.handles.segments[index].position = segment.point;
      });
      this.item.curves.forEach((curve, index) => {
        if (this.handle && this.curveIndex === index) {
          this.handles.curves[index].fillColor.red = 1;
          this.handles.curves[index].fillColor.green = 0.494;
          this.handles.curves[index].fillColor.blue = 0.474;
        } else {
          this.handles.curves[index].fillColor.red = 1;
          this.handles.curves[index].fillColor.green = 1;
          this.handles.curves[index].fillColor.blue = 1;
        }
        this.handles.curves[index].position =
          curve.getLocationAtTime(0.5).point;
      });
    }
  }
  applyAction(action) {
    if (action === "add") {
      if (this.handle && !isNaN(this.segmentIndex)) {
        this.item.insert(
          this.segmentIndex,
          this.item.segments[this.segmentIndex].point.add(
            new this.canvas.Point(20, 0)
          )
        );
      }
    }
    if (action === "remove") {
      if (this.handle && !isNaN(this.segmentIndex)) {
        this.item.removeSegment(this.segmentIndex);
      }
    }
    if (action === "straight") {
      if (this.handle && !isNaN(this.curveIndex)) {
        if (this.item.curves[this.curveIndex]) {
          this.item.curves[this.curveIndex].bezier = {
            distance: 0,
            percentage: 50,
          };
          this.updateBezier(
            this.item.curves[this.curveIndex].segment2.point.add(
              this.getBezierPos(this.item.curves[this.curveIndex])
            ),
            this.item.curves[this.curveIndex]
          );
        }
      }
    }
  }
  transform(position) {
    if (this.editingMode) {
      if (this.item.segments) {
        if (
          this.item.segments[this.segmentIndex] &&
          this.handle === "segment"
        ) {
          this.item.segments[this.segmentIndex].point =
            this.item.segments[this.segmentIndex].point.add(position);
          let segmentCurve = this.item.segments[this.segmentIndex].curve;
          let prevSegmentCurve = this.item.segments[this.segmentIndex].previous
            ? this.item.segments[this.segmentIndex].previous.curve
            : null;
          this.updateBezier(
            segmentCurve.getLocationAtTime(0.5).point,
            segmentCurve
          );
          if (prevSegmentCurve) {
            this.updateBezier(
              prevSegmentCurve.getLocationAtTime(0.5).point,
              prevSegmentCurve
            );
          }
        }
        if (this.item.curves[this.curveIndex] && this.handle === "curve") {
          let curveHandler = this.handles.curves.find(
            (curve) => curve.curveIndex === this.curveIndex
          );
          this.updateBezier(
            curveHandler.position.add(position),
            this.item.curves[this.curveIndex]
          );
        }
      }
      // handle text editing mode
      if (typeof this.item.setCursorPosition === "function") {
        this.item.setCursorPosition(this.item.globalToLocal(position));
      }
    } else if (this.handle === "bounds") {
      this.group.position = this.group.position.add(position);
      // group temp
      this.group.children.forEach((children, index) => {
        if (
          this.group.children.length > 1 &&
          children.symmetryIndex !== undefined
        ) {
          children.symmetryCenter = children.symmetryCenter.add(position);
          if (this.group.children.length - 1 === index) {
            this.symmetryHandler.updateSymmetry(children);
          }
        }
      });
    } else if (this.handle === "middleTop") {
      let handleVector = this.handles.bounds.bounds.center.subtract(
        this.handles[this.handle].position
      );
      let handleWithPositionVector = this.handles.bounds.bounds.center.subtract(
        this.handles[this.handle].position.add(position)
      );
      this.group.rotate(handleWithPositionVector.angle - handleVector.angle);
    } else if (this.handles[this.handle]) {
      let handleVector = this.handles.bounds.bounds.center.subtract(
        this.handles[this.handle].position
      );
      let handleWithPositionVector = this.handles.bounds.bounds.center.subtract(
        this.handles[this.handle].position.add(position)
      );
      let scale = handleWithPositionVector.length / handleVector.length;
      this.group.scale(scale);
      // group temp
      this.group.children.forEach((children, index) => {
        if (
          this.group.children.length > 1 &&
          children.symmetryIndex !== undefined &&
          this.group.children.length - 1 === index
        ) {
          this.symmetryHandler.updateSymmetry(children);
        }
      });
    }
    this.symmetryHandler.updateSymmetry(this.item);
    // we hide handles if we have any resize/rotate action
    this.updateHandles(
      false,
      !this.editingMode &&
        this.handle !== "bounds" &&
        this.handles[this.handle],
      position
    );
  }
  isIntersection(item) {
    if (item === this.handles.bounds) return true;
    if (item === this.handles.topLeft) return true;
    if (item === this.handles.topRight) return true;
    if (item === this.handles.bottomLeft) return true;
    if (item === this.handles.bottomRight) return true;
    if (item === this.handles.middleTop) return true;
    if (item === this.handles.middleTopOffset) return true;
    return false;
  }
  remove(removeGroup = true) {
    this.handles.bounds.remove();
    this.handles.topLeft.remove();
    this.handles.topRight.remove();
    this.handles.bottomLeft.remove();
    this.handles.bottomRight.remove();
    this.handles.middleTop.remove();
    this.handles.middleTopOffset.remove();
    this.removeSegmentHandles();
    // remove group
    if (this.group && removeGroup) {
      let items = this.group.removeChildren();
      this.canvas.project.activeLayer.insertChildren(this.group.index, items);
      this.group.remove();
    }
  }
}
class EventsHandler extends BaseHandler {
  constructor(props) {
    super(props);
    this.initSelectionTool();
    this.activateSelectionTool();
  }
  initSelectionTool() {
    this.selectionTool = new this.handlers.canvas.Tool();
    this.canvas.view.element.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      event.stopPropagation();
      return false;
    });
    this.canvas.view.element.addEventListener("wheel", (event) => {
      const isCtrlKey = event.ctrlKey;
      const delta = Math.sign(event.deltaY);
      const step = 12;
      const min = 0.4;
      const max = 10;
      let zoom = this.canvas.view.zoom - delta / step;
      zoom = Math.min(Math.max(min, zoom), max);
      if (isCtrlKey) {
        var beta = this.canvas.view.zoom / zoom;

        var mousePosition = new this.canvas.Point(event.offsetX, event.offsetY);

        //viewToProject: gives the coordinates in the Project space from the Screen Coordinates
        var viewPosition = this.canvas.view.viewToProject(mousePosition);

        var mpos = viewPosition;
        var ctr = this.canvas.view.center;

        var pc = mpos.subtract(ctr);
        var offset = mpos.subtract(pc.multiply(beta)).subtract(ctr);

        this.canvas.view.zoom = zoom;
        this.canvas.view.center = this.canvas.view.center.add(offset);
      } else {
        this.canvas.view.center = this.canvas.view.center.subtract(
          new this.canvas.Point(-event.deltaX / 2, -event.deltaY / 2)
        );
      }
      this.handlers.layersHandler.drawBackground();
      if (this.selectionTool.activeSelection) {
        this.selectionTool.activeSelection.updateHandles(true);
      }
      this.context.setZoom(zoom);
      event.preventDefault();
      event.stopPropagation();
    });
    this.selectionTool.onMouseDown = (event) => {
      this._historyAction = false;
      // in case if we're in editing mode
      let editingMode =
        this.selectionTool.activeSelection &&
        this.selectionTool.activeSelection.editingMode;

      let hitResult = this.canvas.project.hitTest(event.point, {
        segments: true,
        stroke: true,
        fill: true,
        tolerance: 5 / this.canvas.view.zoom,
      });
      let item = hitResult && hitResult.item;
      if (!item && !editingMode) {
        this.selectionTool.activeSelection &&
          this.selectionTool.activeSelection.remove();
        this.selectionTool.activeSelection = null;
        this.context.setActiveSelection(null);
        this.context.setActivePanel("Layout");
        return;
      }
      // handle when we mousedown on selection
      if (this.selectionTool.activeSelection) {
        this.selectionTool.activeSelection.handle = item && item.handle;
        this.selectionTool.activeSelection.segmentIndex =
          item && item.segmentIndex;
        this.selectionTool.activeSelection.curveIndex = item && item.curveIndex;
        this.context.setActiveEditingModeHandle(
          this.selectionTool.activeSelection.handle
        );
        // trigger action in editing mode
        if (
          this.selectionTool.activeSelection.editingMode &&
          this.selectionTool.activeSelection.editingModeAction
        ) {
          this.selectionTool.activeSelection.transform(event.point);
        }
        // handle editing mode for text
        if (
          this.selectionTool.activeSelection.editingMode &&
          this.selectionTool.activeSelection.item.editingMode
        ) {
          this.selectionTool.activeSelection.transform(event.point);
        }
      }
      if (
        !this.selectionTool.activeSelection ||
        (this.selectionTool.activeSelection &&
          !this.selectionTool.activeSelection.isIntersection(item) &&
          !editingMode)
      ) {
        if (
          this.selectionTool.activeSelection &&
          !this.selectionTool.activeSelection.isIntersection(item) &&
          !editingMode
        ) {
          this.selectionTool.activeSelection.remove();
          this.selectionTool.activeSelection = null;
        }
        if (!editingMode) {
          this.selectionTool.activeSelection = new Transformer({
            item: [item],
            symmetryHandler: this.handlers.symmetryHandler,
            handle: "bounds",
            canvas: this.handlers.canvas,
          });
          this.context.setActiveSelection(item);
          // set active panel based on item type
          if (item._class === "PathText") {
            this.context.setActivePanel("Text");
          }
          if (item._class === "Path") {
            this.context.setActivePanel("Symmetry");
          }
        }
      }
    };
    this.selectionTool.onMouseDrag = (event) => {
      if (
        this.selectionTool.activeSelection &&
        !this.selectionTool.activeSelection.editingModeAction
      ) {
        this._historyAction = true;
        let pointDelta = event.point.subtract(event.lastPoint);
        this.selectionTool.activeSelection.transform(pointDelta);
      } else {
        // pan
        this.canvas.view.center = this.canvas.view.center.subtract(
          event.point.subtract(event.downPoint)
        );
        this.handlers.layersHandler.drawBackground();
      }
    };
    this.selectionTool.onMouseUp = (event) => {
      if (this.selectionTool.activeSelection) {
        this.selectionTool.activeSelection.updateHandles();
      }
      if (this._historyAction) {
        this.handlers.historyHandler.snapshot();
      }
    };
  }
  enterEditingMode() {
    if (this.selectionTool.activeSelection) {
      this.selectionTool.activeSelection.editingMode = true;
      if (
        typeof this.selectionTool.activeSelection.item.enterEditing ===
        "function"
      ) {
        this.selectionTool.activeSelection.item.enterEditing();
      }
      this.selectionTool.activeSelection.updateHandles();
    }
  }
  updateHandles() {
    this.selectionTool.activeSelection.updateHandles();
  }
  exitEditingMode() {
    if (this.selectionTool.activeSelection) {
      this.selectionTool.activeSelection.editingMode = false;
      if (
        typeof this.selectionTool.activeSelection.item.exitEditing ===
        "function"
      ) {
        this.selectionTool.activeSelection.item.exitEditing();
      }
      this.selectionTool.activeSelection.updateHandles();
    }
  }
  setEditingAction(action) {
    if (this.selectionTool.activeSelection) {
      this.selectionTool.activeSelection.applyAction(action);
      this.selectionTool.activeSelection.updateHandles();
    }
  }
  setActiveSelection(item) {
    this.removeSelection();
    if (!item) return;
    this.selectionTool.activeSelection = new Transformer({
      item: [...arguments],
      symmetryHandler: this.handlers.symmetryHandler,
      handle: "bounds",
      canvas: this.handlers.canvas,
    });
    this.context.setActiveSelection(item);
    // set active panel based on item type
    if (item._class === "PathText") {
      this.context.setActivePanel("Text");
    }
    if (item._class === "Path") {
      this.context.setActivePanel("Symmetry");
    }
  }
  activateSelectionTool() {
    this.selectionTool.activate();
  }
  removeSelection() {
    this.exitEditingMode();
    this.selectionTool.activeSelection &&
      this.selectionTool.activeSelection.remove();
    this.selectionTool.activeSelection = null;
    this.context.setActiveSelection(null);
    //this.context.setActivePanel("Layout");
  }
  removeItem() {
    if (this.selectionTool.activeSelection) {
      this.selectionTool.activeSelection.group.remove();
      this.selectionTool.activeSelection.group._children = [];
      this.removeSelection();
      //item.remove();
    }
  }
}
export default EventsHandler;
