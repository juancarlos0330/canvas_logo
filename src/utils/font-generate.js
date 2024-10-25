var fs = require("fs");
let fontsList = [];
const getDirectories = (source) =>
  fs
    .readdirSync(source, {
      withFileTypes: true,
    })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

getDirectories("../../public/fonts/").forEach((directory) => {
  fontsList.push({
    name: directory,
    files: fs
      .readdirSync(`../../public/fonts/${directory}`, {
        withFileTypes: true,
      })
      .map((dirent) => dirent.name),
  });
});

let fontsOutput = [];
fontsList.forEach((list) => {
  list.files.forEach((file) => {
    if (file !== ".DS_Store") {
      fontsOutput.push({
        fontFamily: file.substring(
          file.indexOf("_") || 0,
          file.lastIndexOf(".")
        ),
        url: `process.env.PUBLIC_URL/fonts/${list.name}/${file}`,
      });
    }
  });
});
fs.writeFile("fonts.js", JSON.stringify(fontsOutput), function (err) {
  if (err) return console.log(err);
  console.log("Done, fonts.js file generated");
});
