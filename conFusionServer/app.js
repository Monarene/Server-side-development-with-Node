// Introducing all the modules
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var mongoose = require("mongoose");
var Dishes = require("./models/dishes");
var logger = require("morgan");

// Introducing all the routes
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var promotionRouter = require("./routes/promotionRouter");
var leaderRouter = require("./routes/leaderRouter");
var dishRouter = require("./routes/dishRouter");

var url = "mongodb://localhost:27017/conFusion";

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const auth = (req, res, next) => {
  console.log(req.headers);
  var authHeader = req.headers.authorization;
  if (!authHeader) {
    var err = new Error("You are not authenticated");
    res.setHeader("WWW-Authenticate", "Basic");
    err.status = 401;
    next(err);
    return next(err);
  }

  var auth = new Buffer.from(authHeader.split(" ")[1], "base64")
    .toString()
    .split(":");
  var user = auth[0];
  var pass = auth[1];
  if (user == "admin" && pass == "password") {
    next();
  } else {
    var err = new Error("You are not authenticated");
    res.setHeader("WWW-Authenticate", "Basic");
    err.status = 401;
  }
};

app.use(auth);
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/dishes", dishRouter);
app.use("/promotions", promotionRouter);
app.use("/leaders", leaderRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// Connecting the app to the db
const connect = mongoose.connect(url);
connect.then(
  (db) => {
    console.log("Connected correctly to server");
  },
  (err) => {
    console.log(err);
  }
);

module.exports = app;
