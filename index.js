const http = require('http');
const path = require('path');
const fs = require('fs');

const loadFile = (res, fileNameToLoad) => {
  const fileName = path.join(__dirname, "public", fileNameToLoad);
  let contentType = 'text/html';
  if (fileNameToLoad.endsWith('.css')) {
    contentType = 'text/css';
  } else if (fileNameToLoad.endsWith(".js")) {
    contentType = 'text/javascript';
  }
  fs.readFile(fileName, "utf8", (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end("<h1>Couldn't find page</h2>");
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    }
  });
}
const STATIC_RESOURCES_PREFIX = '/public/';
const PORT = 4000;
const server = http.createServer((req, res) => {
  const url = req.url;

  if (url === STATIC_RESOURCES_PREFIX + "welcome.html") {
    const fileName = path.join(__dirname, "public", "welcome.html");
    fs.readFile(fileName, "utf8", (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end("<h1>Couldn't find page</h2>");
      } else {
        data = data.replace("#name#", "ameed");
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
      }
    });
  } else {
    let resource = null;
    if (url.startsWith(STATIC_RESOURCES_PREFIX)) {
      resource = url.substring(STATIC_RESOURCES_PREFIX.length);
    }
    if (resource == null) {
      res.writeHead(200, { "Content-Type": "text/html" });
      const html = `<html><body><h1>This is my first web server !</h1>${new Date()}</body></html>`;
      res.end(html);
    } else {
      loadFile(res, resource);
    }
  }
});

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
