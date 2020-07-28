var mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
  "userId":String,
  "userName":String,
  "userPwd":String,
  "orderList":Array,
  "cartList":[
    {
      "productId":String,
      "productName":String,
      "salePrice":String,
      "productImage":String,
      "checked":Boolean,
      "productNum":Number
    }
  ],
  "addressList":[
    {
      "addressId":String,
      "recipient":String,
      "street":String,
      "postCode":String,
      "tel":String,
      "isDefault":Boolean
    }
  ]
})


module.exports = mongoose.model("User",userSchema,"users")