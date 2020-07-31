var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var usersRouter = require("./routes/users");
var goodsRouter = require("./routes/goods");
var { getJsonFile } = require("./utils/index");
var mongoose = require("mongoose");
var app = express();

require("dotenv").config();




app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));




const root = require('path').join(__dirname, '../dist')
app.use(express.static(root));


//路由拦截
app.use((req, res, next) => {
  if (req.cookies.userId) {
    next();
  } else {
    let url = req.originalUrl;
    if (
      (url.startsWith("/api/goods") && url !== "/api/goods/addToCart") ||
      url.startsWith("/api/users/login")
    ) {
      next();
    } else {
      res.json(getJsonFile(false, "Please login", null));
    }
  }
});



app.use("/api/users", usersRouter);
app.use("/api/goods", goodsRouter);


app.get("*", (req, res) => {
  res.sendFile('index.html', { root });
})


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

let mongoURL =
  `mongodb+srv://${process.env["MONGO_USER"]}:${process.env["MONGO_PASSWORD"]}@cluster0.lpdkl.mongodb.net/vue_mall?retryWrites=true&w=majority`;


mongoose.connect(mongoURL,{
  useNewUrlParser: true
})

mongoose.connection.on("open", function() {
  console.log("MongoDB connected success.");
});

mongoose.connection.on("error", function() {
  console.log("MongoDB connected fail.");
});

mongoose.connection.on("disconnected", function() {
  console.log("MongoDB connected disconnected.");
});




app.listen(process.env.PORT || 3000);


// module.exports = app;
