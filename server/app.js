var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ejs = require('ejs')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var goodsRouter = require('./routes/goods')
var {getJsonFile} = require('./utils/index')
var mongoose = require("mongoose");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html',ejs.__express)
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());    
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
  

//路由拦截

app.use((req,res,next)=>{
  if (req.cookies.userId){
    next()
  }else{
      let url = req.originalUrl
      if( (url.startsWith('/api/goods') && url !== '/api/goods/addToCart') || url.startsWith('/api/users/login')){
        next()
      }else{
        res.json(getJsonFile(false,'Please login',null))
      }
    

  }
})
app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/goods',goodsRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});




var Admin = mongoose.mongo.Admin;

// let mongoURL = "mongodb+srv://admin:<password>@cluster0.lpdkl.mongodb.net/<dbname>?retryWrites=true&w=majority"
// 连接数据库
mongoose.connect("mongodb://root:654321@127.0.0.1:27017/vue_mall", {
  useNewUrlParser: true
});

// mongoose.connect(mongoURL,{
//   useNewUrlParser: true
// })

mongoose.connection.on("open", function() {
  console.log("MongoDB connected success.");
  new Admin(mongoose.connection.db).listDatabases(function(err, res) {
    var allDatabases = res.databases;
    console.log(allDatabases[4]);
  });
});

mongoose.connection.on("error", function() {
  console.log("MongoDB connected fail.");
});

mongoose.connection.on("disconnected", function() {
  console.log("MongoDB connected disconnected.");
});

module.exports = app;
