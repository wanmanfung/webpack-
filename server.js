const http = require("http");
const url = require("url");
const util = require("util");
const fs = require("fs");

const readFile = (path, res) => {
  try {
    const file = fs.readFileSync("." + path);
    res.write(file.toString());
  } catch (error) {}
};

http
  .createServer((req, res) => {
    res.writeHead(200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*",
    });
    if (req.url === "/") {
      res.write("end");
    } else {
      readFile(req.url, res);
    }
    res.end();
  })
  .listen(3000);
