var express = require("express");

var router = express.Router();

var mongoose = require("mongoose");
var Good = require("../models/goods");
var User = require('../models/users')
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

router.get("/", function(req, res) {
  let page = parseInt(req.param("page"));
  let pageSize = parseInt(req.param("pageSize"));
  let sort = req.param("sort") ? parseInt(req.param("sort")) : 1;
  let priceRange = req.param("priceRange");
  let skipNum = (page - 1) * pageSize;
  let params = {};

  let lowerPrice = "";
  let upperPrice = "";

  if (priceRange !== "all") {
    switch (priceRange) {
      case "0":
        lowerPrice = 0;
        upperPrice = 100;
        break;
      case "1":
        lowerPrice = 100;
        upperPrice = 500;
        break;
      case "2":
        lowerPrice = 500;
        upperPrice = 1000;
        break;
      case "3":
        lowerPrice = 1000;
        upperPrice = 5000;
        break;
    }
    params = {
      salePrice: {
        $gt: lowerPrice,
        $lte: upperPrice
      }
    };
  }

  let GoodsModel = Good.find(params)
    .skip(skipNum)
    .limit(pageSize);
  GoodsModel.sort({ salePrice: sort });

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

//添加商品到该用户名下的cartList
router.post("/addToCart", function(req, res) {
  let userId = "100000077";
  let productId = req.body.productId;


  User.findOne(
    {
      userId: userId
    },
    function(err1, userDoc) {
      if (err1) {
        res.json({
          status: "1",
          msg: err1.message
        });
      } else {
        if (userDoc) {
          Good.findOne({ productId: productId }, function(err, doc) {
            if (err) {
              res.json({
                status: "1",
                msg: err.message
              });
            } else {
              if(doc){
                doc.productNumber = 1
                doc.checked = 1
                userDoc.cartList.push(doc)
                userDoc.save(function(err2,doc2){
                  if (err2) {
                    res.json({
                      status: "1",
                      msg: err2.message
                    })
                    }else{
                      res.json({
                        status: "1",
                        msg:"",
                        result:doc2
                      })
                    }
                })
              }
            }
          });
        }
      }
    }
  );
});

module.exports = router;
