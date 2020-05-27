//importing all the necessary tools
const express = require("express");
const http = require("http");
const morgan = require("morgan");

// setting up all the Routers
const bodyparser = require("body-parser");

const leaderRouter = require("./routes/leaderRouter");
const dishRouter = require("./routes/dishRouter");
const promotionRouter = require("./routes/promotionRouter");

// Declaring the necessary variables
const hostname = "localhost";
const port = 3000;

// defining the app usages and How they roll
const app = express();
app.use(morgan("dev"));
app.use(bodyparser.json());

app.use(express.static(__dirname + "/public"));

// defining the routes to the router
app.use("/leaders", leaderRouter);
app.use("/dishes", dishRouter);
app.use("/promotions", promotionRouter);

/* app.use((req, res, next) => {
  console.log(req.headers);
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html");
  res.end("<html><body><h1>This is an Express Server</h1></body></html>");
}); */

// The routing for the dishes:Id

const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server running at https://${hostname}:${port}`);
});
