import BaseHandler from "./BaseHandler";
import Typr from "../objects/text/Typr";
import Fonts from "../../constants/fonts";

class FontHandler extends BaseHandler {
  constructor(props) {
    super(props);
    this.canvas.project.fonts = [];
    this.loadFont("Roboto-Regular");
  }
  loadFont(fontFamily, callback) {
    let fontMatch = this.canvas.project.fonts.find(
      (font) => font.fontFamily === fontFamily
    );
    let listMatch = Fonts.find((font) => font.fontFamily === fontFamily);
    if (fontMatch || !listMatch) {
      callback && callback();
      return;
    }
    fetch(listMatch.url)
      .then((response) => {
        return response.arrayBuffer();
      })
      .then((buffer) => {
        this.canvas.project.fonts.push({
          fontFamily: listMatch.fontFamily,
          font: Typr.parse(buffer)[0],
          typr: Typr,
        });
        callback && callback();
        this.canvas.view._needsUpdate = true;
        this.canvas.view.requestUpdate();
      });
  }
}
export default FontHandler;
