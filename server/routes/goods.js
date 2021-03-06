var express = require("express");

var router = express.Router();

var Good = require("../models/goods");
var User = require("../models/users");


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
    function(err, userDoc) {
      if (err) {
        res.json({
          status: "1",
          msg: err.message
        });
      } else {
        
        if (userDoc) {
          let goodsItem = "";
          userDoc.cartList.forEach(item => {
            if (item.productId === productId) {
              goodsItem = item;
              item.productNum++
            }
          });
          if (!goodsItem) {
          
            Good.findOne({ productId: productId }, function(err, doc) {
              if (err) {
                res.json({
                  status: "1",
                  msg: err.message
                });
              } else {
                if (doc) {
                  doc.productNum = 1;
                  doc.checked = true;
                  userDoc.cartList.push(doc);
                  userDoc.save(function(err2, doc2) {
                    if (err2) {
                      res.json({
                        status: "1",
                        msg: err2.message
                      });
                    } else {
                      res.json({
                        status: "0",
                        msg: "",
                        result: doc2
                      });
                    }
                  });
                }
              }
            });
          }else{
            userDoc.save(function(err2, doc2) {
              if (err2) {
                res.json({
                  status: "1",
                  msg: err2.message
                });
              } else {
                res.json({
                  status: "0",
                  msg: "",
                  result: doc2
                });
              }
            });
          }
          
        }
      }
    }
  );
});

module.exports = router;
