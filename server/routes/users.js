var express = require("express");
var router = express.Router();
const { getJsonFile, generateOrderInfo } = require("../utils/");
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
    checked = req.body.checked;
  console.log(productNum);
  User.update(
    { userId: userId, "cartList.productId": productId },
    //If you don't know the position of edited element, the '$' sign can be used.
    { "cartList.$.checked": !!checked, "cartList.$.productNum": productNum },
    (err, doc) => {
      if (err) {
        res.json(getJsonFile(false, err.message, null));
      } else {
        res.json(getJsonFile(true, "edit success", doc));
      }
    }
  );
});

router.post("/checkAll", (req, res) => {
  let userId = req.cookies.userId,
    checkAll = req.body.checkAll;

  User.findOne({ userId: userId }, (err, userDoc) => {
    if (err) {
      res.json(getJsonFile(false, err.message, null));
    } else {
      if (userDoc) {
        userDoc.cartList.forEach(item => {
          item.checked = checkAll;
        });

        userDoc.save((err1, doc) => {
          if (err1) {
            res.json(getJsonFile(false, err1.message, err1));
          } else {
            res.json(getJsonFile(true, "success", doc));
          }
        });
      }
    }
  });
});

//Get the address list of user
router.get("/addressList", (req, res) => {
  let userId = req.cookies.userId;
  User.findOne({ userId: userId }, (err, doc) => {
    if (err) {
      res.json(getJsonFile(false, err.message, err));
    } else {
      res.json(getJsonFile(true, "Get address success", doc));
    }
  });
});
//set the default address
router.post("/setDefaultAddress", (req, res) => {
  let userId = req.cookies.userId,
    addressId = req.body.addressId;

  if (!addressId) {
    res.json(getJsonFile(false, "address is not existed", null));
  }
  User.findOne({ userId: userId }, (err, doc) => {
    if (err) {
      res.json(getJsonFile(false, err.message, err));
    } else {
      console.log(doc);
      let addressList = doc.addressList;

      addressList.forEach(item => {
        if (item.addressId === addressId) {
          item.isDefault = true;
        } else {
          item.isDefault = false;
        }
      });

      doc.save(err1 => {
        if (err1) {
          res.json(getJsonFile(false, err1.message, null));
        } else {
          res.json(getJsonFile(true, "set success", null));
        }
      });
    }
  });
});

//Delete address
router.post("/deleteAddress", (req, res) => {
  let userId = req.cookies.userId,
    addressId = req.body.addressId;
  console.log(addressId);
  User.update(
    {
      userId: userId
    },
    {
      $pull: {
        addressList: {
          addressId: addressId
        }
      }
    },
    (err, doc) => {
      if (err) {
        res.json(getJsonFile(false, err.message, null));
      } else {
        res.json(getJsonFile(true, "delete success", doc));
      }
    }
  );
});

//Make payment
router.post("/makePayment", (req, res) => {
  let userId = req.cookies.userId,
    paymentAmount = req.body.paymentAmount,
    addressId = req.body.addressId;
  //get user address
  User.findOne({ userId: userId }, (err, doc) => {
    if (err) {
      res.json(getJsonFile(err, err.message, null));
    } else {
      let curAddress = "";
      let goodsList = [];
      doc.addressList.forEach(item => {
        if (item.addressId === addressId) {
          curAddress = item;
        }
      });

      let tempCartList = [];
      //get cart list
      doc.cartList.filter(item => {
        if (item.checked) {
          goodsList.push(item);
        } else {
          tempCartList.push(item);
        }
      });

      let { orderId, date } = generateOrderInfo();

      //create order
      let order = {
        orderId: orderId,
        paymentAmount: paymentAmount,
        address: curAddress,
        goodsList: goodsList,
        orderStatus: "unpaid",
        date: date
      };
      //update cartlist
      doc.cartList = tempCartList;
      doc.orderList.push(order);

      doc.save(err1 => {
        if (err1) {
          res.json(getJsonFile(false, err1.message, null));
        } else {
          res.json(
            getJsonFile(true, "Order is created!", {
              orderId: order.orderId,
              paymentAmount: order.paymentAmount
            })
          );
        }
      });
    }
  });
});

//get order information

router.get("/orderInfo", (req, res) => {
  let userId = req.cookies.userId,
    orderId = req.param("orderId");
  User.findOne({ userId: userId }, (err, doc) => {
    if (err) {
      res.json(getJsonFile(false, err.message, null));
    } else {
      let orderList = doc.orderList;
      if (orderList.length > 0) {
        let order;
        orderList.forEach(item => {
          if (item.orderId === orderId) {
            order = item;
          }
        });

        if (order) {
          res.json(
            getJsonFile(true, "Get order Success", {
              orderId: order.orderId,
              paymentAmount: order.paymentAmount
            })
          );
        } else {
          res.json(getJsonFile(false, "No order", null));
        }
      } else {
        res.json(getJsonFile(false, "No orders", null));
      }
    }
  });
});

//get counts of cart

router.get("/getCartCount", (req, res) => {
  let userId = req.cookies.userId;

  User.findOne({ userId: userId }, (err, doc) => {
    if (err) {
      res.json(getJsonFile(false, err.message, null));
    } else {
      let counts = 0;
      doc.cartList.forEach(item => {
        counts += parseInt(item.productNum);
      });

      res.json(getJsonFile(true, "Get counts of cart success", counts));
    }
  });
});

module.exports = router;
