var express = require("express");
var router = express.Router();
const { getJsonFile } = require("../utils/");
var User = require("./../models/users");

/* GET users listing. */
router.get("/", function(req, res) {
  res.send("respond with a resource");
});

router.post("/login", function(req, res) {
  var param = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  };
  User.findOne(param, (err, doc) => {
    if (err) {
      res.json(getJsonFile(false, "login fail", null));
    } else {
      if (doc) {
        if (req.cookies !== doc.userId) {
          res.cookie("userId", doc.userId, {
            //Cookies sent to clients can be set for a specific path, not just a domain.
            path: "/",
            maxAge: 1000 * 60 * 60
          });
          res.cookie("userName", doc.userName, {
            //Cookies sent to clients can be set for a specific path, not just a domain.
            path: "/",
            maxAge: 1000 * 60 * 60
          });
        }
        let result = {
          userName: doc.userName
        };
        res.json(getJsonFile(true, "login success", result));
      } else {
        res.json(getJsonFile(false, "user is not existed", null));
      }
    }
  });
});

router.post("/logout", (req, res) => {
  res.cookie("userId", "", {
    path: "/",
    maxAge: -1
  });
  res.json(getJsonFile(true, "logout success", null));
});

router.get("/loginValidation", (req, res) => {
  if (req.cookies.userId) {
    res.json(getJsonFile(true, "already login", req.cookies.userName));
  } else {
    res.json(getJsonFile(false, "please login", null));
  }
});

//Get the cart list
router.get("/cartList", (req, res) => {
  let userId = req.cookies.userId;
  User.findOne({ userId }, (err, doc) => {
    if (err) {
      res.json(getJsonFile(false, err.message, null));
    } else {
      if (doc) {
        res.json(getJsonFile(true, "get cart list success", doc.cartList));
      }
    }
  });
});
//Delete the item of cart
router.post("/delItem", (req, res) => {
  let userId = req.cookies.userId,
    productId = req.body.productId;

  //The $pull operator removes from an existing array all instances of a value or values that match a specified condition.
  User.update(
    { userId: userId },
    { $pull: { cartList: { productId: productId } } },
    (err, doc) => {
      if (err) {
        res.json(getJsonFile(false, err.message, null));
      } else {
        res.json(getJsonFile(true, "delete success", doc));
      }
    }
  );
});

//edit number of item
router.post("/editItem", (req, res) => {
  let userId = req.cookies.userId,
    productId = req.body.productId,
    productNum = req.body.productNum,
    checked = req.body.checked

  User.update(
    { userId: userId, "cartList.productId": productId },
    //If you don't know the position of edited element, the '$' sign can be used.
    { "cartList.$.checked": !!checked },
    { "cartList.$.productNum": productNum },
    (err, doc) => {
      if (err) {
        res.json(getJsonFile(false, err.message, null));
      } else {
        res.json(getJsonFile(true, "edit success", doc));
      }
    }
  );
});

router.post("/checkAll", (req,res) => {
  let userId = req.cookies.userId,
  checkAll = req.body.checkAll

  User.findOne({userId:userId},(err,userDoc) => {
    if(err){
      res.json(getJsonFile(false,err.message,null))
    }else{
      if(userDoc){
        userDoc.cartList.forEach( (item) => {
          item.checked = checkAll
        })

        userDoc.save((err1,doc) => {
          if(err1){
            res.json(getJsonFile(false,err1.message,err1))
          }else{
            res.json(getJsonFile(true,'success',doc))
          }
        })
      }
    }
  })
})
module.exports = router;
