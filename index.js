const http = require("http");

const product = {
  name: "Spaghetti",
  price: "$1",
  category: "Pasta",
};

const server = http.createServer((request, response) => {
  response.writeHead(200, { "Content-Type": "text/html" });
  response.end(`
    <!doctype html>
    <html>
      <body>
        <h1>Product Information</h1>
        <p>Name: ${product.name}</p>
        <p>Price: ${product.price}</p>
        <p>Category: ${product.category}</p>
      </body>
    </html>
  `);
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});