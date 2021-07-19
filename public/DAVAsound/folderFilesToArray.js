const fs = require("fs"),
  path = require("path");
function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach((f) => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const mp3List = [];
walkDir("./", function (filePath) {
  if (filePath.split(".")[1] === "mp3") {
    mp3List.push(filePath);
  }
});

// walkDir("./", function (filePath) {
//   if (filePath.split(".")[1] === "ts" && mp3List.includes(filePath)) {
//     console.log(`${filePath} already exist`);
//   } else if (
//     filePath.split(".")[1] === "json" &&
//     !mp3List.includes(`${filePath.split(".")[0]}.ts`)
//   ) {
//     const rawdata = fs.readFileSync(path.resolve(__dirname, filePath));

//     let parsedData = JSON.parse(rawdata);

//     const fileName = filePath.split(".")[0];

//   }
// });
const nameList = mp3List.map(name => `"${name}"`)

fs.writeFile(
  `sounds.json`,
  `[${nameList}]`,
  function (err) {
    if (err) throw err;
    console.log(`sounds.json saved!`);
  }
);
console.log(mp3List);
const rand = Math.floor(Math.random() * mp3List.length - 1)
console.log("=======> ", mp3List[rand]);
