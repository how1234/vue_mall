var express = require("express");

var router = express.Router();

var mongoose = require("mongoose");
var Goods = require("../models/goods");
var Admin = mongoose.mongo.Admin;


//连接数据库
mongoose.connect("mongodb://root:654321@127.0.0.1:27017/vue_mall", {
  useNewUrlParser: true
});

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

router.get("/", function(req, res, next) {
  let page = parseInt(req.param("page"))
  let pageSize = parseInt(req.param("pageSize"))
  let sort = req.param("sort") ? parseInt(req.param("sort")) : 1
  let skipNum = (page-1) * pageSize 
  let params = {}

  let GoodsModel = Goods.find(params).skip(skipNum).limit(pageSize)
  GoodsModel.sort({"salePrice":sort})


  GoodsModel.exec(function(err, doc) {
    if (err) {
      res.json({
        status: "1",
        msg: err.message
      });
    } else {
      res.json({
        status: "0",
        msg: "",
        result: {
          count: doc.length,
          list: doc
        }
      });
    }
  });
});

module.exports = router;
