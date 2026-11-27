const http = require("http");
const fs = require("fs");
const path = require("path");

const product = {
  name: "Spaghetti",
  price: "$1",
  category: "Pasta",
};

const routes = {
  "/": {
    file: "index.html",
    contentType: "text/html; charset=utf-8",
  },
  "/src/app.js": {
    file: path.join("src", "app.js"),
    contentType: "text/javascript; charset=utf-8",
  },
  "/src/cart.js": {
    file: path.join("src", "cart.js"),
    contentType: "text/javascript; charset=utf-8",
  },
  "/src/products.js": {
    file: path.join("src", "products.js"),
    contentType: "text/javascript; charset=utf-8",
  },
};

const server = http.createServer((req, res) => {
  const pathname = new URL(req.url, "http://localhost").pathname;
  const route = routes[pathname];

  if (!route) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Page Not Found");
    return;
  }

  const filePath = path.join(__dirname, route.file);

  fs.readFile(filePath, (err, content) => {
    if (err) {
      console.error(`Failed to read ${route.file}:`, err);
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Server Error");
      return;
    }

    res.writeHead(200, { "Content-Type": route.contentType });
    res.end(content);
  });
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});