import paper from "paper";

const PathText = paper.TextItem.extend({
  _class: "PathText",
  spacing: 0,
  layout: {
    lines: [],
    width: 0,
    height: 0,
  },
  editingMode: false,
  _cursorDraw: false,
  initialize: function PathText() {
    paper.TextItem.apply(this, arguments);
    this.computeLayout();
    console.log(this.getProject().fonts);
  },
  getPoint: function () {
    var point = this._matrix.getTranslation();
    return new paper.LinkedPoint(point.x, point.y, this, "setPoint");
  },

  setPoint: function () {
    var point = paper.Point.read(arguments);
    this.translate(point.subtract(this._matrix.getTranslation()));
  },
  getFont: function () {
    return this.getProject().fonts.find(
      (font) => font.fontFamily === this._style.fontFamily
    );
  },
  closest: function (num, arr) {
    var curr = arr[0].x + arr[0].width,
      diff = Math.abs(num - curr),
      index = 0;

    for (var val = 0; val < arr.length; val++) {
      let newdiff = Math.abs(num - arr[val].x + arr[val].width);
      if (newdiff < diff) {
        diff = newdiff;
        curr = arr[val].x + arr[val].width;
        index = val;
      }
    }
    return index;
  },
  computeLayout: function () {
    var textLines = this._content.split(/\r\n|\n|\r/gm);
    this.layout = {
      lines: [],
      positionMap: [],
      width: 0,
      height: 0,
      scale: 1,
    };
    let font = this.getFont();
    if (!font) return;
    this.layout.scale = this._style.fontSize / font.font.head.unitsPerEm;
    for (var i = 0, l = textLines.length; i < l; i++) {
      let layoutLine = {
        text: textLines[i],
        alignOffset: 0,
        draw: null,
        width: 0,
        height: this._style.leading,
      };
      var shape = font.typr.U.shape(font.font, layoutLine.text);
      var path = font.typr.U.shapeToPath(
        font.font,
        shape,
        this.spacing,
        this.layout.scale
      );
      layoutLine.draw = path.draw;
      // new line empty position
      if (i > 0) {
        this.layout.positionMap.push({
          x: 0,
          width: 0,
          y: this._style.leading * i,
          index: i,
        });
      }
      path.positionMap.forEach((position) => {
        this.layout.positionMap.push({
          x: position.x,
          width: position.width,
          y: this._style.leading * i,
          index: i,
        });
      });
      layoutLine.width = path.width;
      this.layout.lines.push(layoutLine);
    }
    // calc layout's width && height
    let maxWidth = 0;
    for (let i = 0; i < this.layout.lines.length; i++) {
      maxWidth = Math.max(this.layout.lines[i].width, maxWidth);
    }
    this.layout.width = maxWidth;
    // update alignOffset
    let justification = this._style.getJustification();
    for (let i = 0; i < this.layout.lines.length; i++) {
      switch (justification) {
        case "left":
          this.layout.lines[i].alignOffset = 0;
          break;
        case "center":
          this.layout.lines[i].alignOffset =
            (this.layout.width - this.layout.lines[i].width) / 2;
          break;
        case "right":
          this.layout.lines[i].alignOffset =
            this.layout.width - this.layout.lines[i].width;
          break;
        default:
          this.layout.lines[i].alignOffset = 0;
      }
    }
    return this.layout;
  },
  getCursorPosition: function () {
    return this.hiddenTextarea.selectionStart ===
      this.hiddenTextarea.selectionEnd
      ? this.hiddenTextarea.selectionStart
      : null;
  },
  setCursorPosition: function (position) {
    console.log(position);
    let lines = this.layout.lines;
    let lineMatch = null;
    for (let i = 0; i < lines.length; i++) {
      if (
        position.y <=
          -lines[i].height * 0.75 + lines[i].height * i + lines[i].height &&
        position.y >= -lines[i].height * 0.75 + lines[i].height * i
      ) {
        lineMatch = { index: i, line: lines[i] };
      }
    }
    if (lineMatch) {
      let lineGlyphs = this.layout.positionMap.filter(
        (position) => position.index === lineMatch.index
      );
      if (lineGlyphs) {
        let closestPosition = this.closest(
          position.x + lineMatch.line.alignOffset,
          lineGlyphs
        );
        if (this.hiddenTextarea) {
          this.hiddenTextarea.selectionStart = this.layout.positionMap.indexOf(
            lineGlyphs[closestPosition]
          );
          this.hiddenTextarea.selectionEnd = this.hiddenTextarea.selectionStart;
          this.resetCursorBlinking();
          this.getView()._needsUpdate = true;
          this.getView().requestUpdate();
        }
      }
    }
  },
  setSelection: function (start, end) {
    this.hiddenTextarea.selectionStart = !isNaN(start)
      ? start
      : this.hiddenTextarea.selectionStart;
    this.hiddenTextarea.selectionEnd = !isNaN(end)
      ? end
      : this.hiddenTextarea.selectionEnd;
  },
  isSelection: function () {
    return (
      this.hiddenTextarea.selectionStart !== this.hiddenTextarea.selectionEnd
    );
  },
  drawCursor: function (ctx) {
    let cursorPosition = this.getCursorPosition();
    let position =
      cursorPosition === 0
        ? { x: 0, y: 0 }
        : this.layout.positionMap[this.getCursorPosition() - 1];
    if (!position) return;
    let leading = 0.75 * this._style.leading;
    ctx.save();
    ctx.fillStyle = this._cursorDraw ? "black" : "transparent";
    ctx.fillRect(
      position.x,
      position.y - leading,
      2 / this.matrix.a,
      this._style.leading
    );
    ctx.restore();
  },
  startCursorBlinking: function () {
    this._cursorDraw = true;
    this.cursorBlinking = setInterval(() => {
      this._cursorDraw = !this._cursorDraw;
      this.getView()._needsUpdate = true;
      this.getView().requestUpdate();
    }, 500);
  },
  resetCursorBlinking: function () {
    if (this.cursorBlinking) {
      this.endCursorBlinking();
      this.startCursorBlinking();
    }
  },
  endCursorBlinking: function () {
    if (this.cursorBlinking) {
      clearInterval(this.cursorBlinking);
      this.cursorBlinking = null;
    }
  },
  enterEditing: function () {
    this.startCursorBlinking();
    this.hiddenTextarea = document.createElement("textarea");
    this.hiddenTextarea.setAttribute("autocapitalize", "off");
    this.hiddenTextarea.setAttribute("autocorrect", "off");
    this.hiddenTextarea.setAttribute("autocomplete", "off");
    this.hiddenTextarea.setAttribute("spellcheck", "false");
    this.hiddenTextarea.setAttribute("data-fabric-hiddentextarea", "");
    this.hiddenTextarea.setAttribute("wrap", "off");
    this.hiddenTextarea.style.cssText =
      "position: absolute; left:0; top:0; z-index: -999; opacity: 0; width: 1px; height: 1px;";
    document.body.appendChild(this.hiddenTextarea);
    this.hiddenTextarea.value = this._content;
    this.hiddenTextarea.focus();
    this.hiddenTextarea.addEventListener("input", (event) => {
      this.setContent(this.hiddenTextarea.value);
      this.computeLayout();
    });
    this.hiddenTextarea.addEventListener("keydown", (event) => {
      this.resetCursorBlinking();
      this.getView()._needsUpdate = true;
      this.getView().requestUpdate();
    });
    this.hiddenTextarea.addEventListener("blur", () => {
      if (this.hiddenTextarea) this.hiddenTextarea.focus();
    });
    this.editingMode = true;
  },
  exitEditing: function () {
    this.endCursorBlinking();
    if (this.hiddenTextarea) {
      this.hiddenTextarea.blur && this.hiddenTextarea.blur();
      this.hiddenTextarea.parentNode &&
        this.hiddenTextarea.parentNode.removeChild(this.hiddenTextarea);
    }
    this.hiddenTextarea = null;
    this.editingMode = false;
  },
  _draw: function (ctx, param, viewMatrix) {
    if (!this._content) return;
    let font = this.getFont();
    if (!font) return;
    this._setStyles(ctx, param, viewMatrix);
    //var lines = this._lines,
    var style = this._style,
      hasFill = style.hasFill(),
      hasStroke = style.hasStroke();
    let lines = this.layout.lines;
    ctx.beginPath();
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      ctx.save();
      ctx.translate(0, line.height * i);
      ctx.translate(line.alignOffset, 0);
      ctx.scale(this.layout.scale, -this.layout.scale);
      font.typr.U.pathToContext(line.draw, ctx);
      ctx.restore();
    }
    if (hasFill) {
      ctx.fill(style.getFillRule());
      ctx.shadowColor = "rgba(0,0,0,0)";
    }
    if (hasStroke) ctx.stroke();
    if (this.editingMode) {
      this.drawCursor(ctx);
    }
  },
  exportSVG: function (options) {
    return "<g>COOL</g>";
  },

  _getBounds: function (matrix, options) {
    var style = this._style,
      lines = this._lines,
      numLines = lines.length,
      leading = style.getLeading(),
      width = this.layout.width,
      x = 0;
    var rect = new paper.Rectangle(
      x,
      numLines ? -0.75 * leading : 0,
      width,
      numLines * leading
    );
    return matrix ? matrix._transformBounds(rect, rect) : rect;
  },
});
export default PathText;
