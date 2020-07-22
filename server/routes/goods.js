var express = require('express')

var router = express.Router()

var mongoose = require('mongoose')
var Goods = require('../models/goods')
var Admin = mongoose.mongo.Admin
console.log(Goods)
//连接数据库
let connection = mongoose.createConnection('mongodb://root:654321@127.0.0.1:27017/vue_mall')

connection.on('connected',function(){
  console.log("Mongo Db connects")
  new Admin(connection.db).listDatabases(function(err,res){
    
    var allDatabases = res.databases
    console.log(allDatabases[4])
  })
})


connection.on('error',function(){
  console.log("Connection Error")
})

connection.on('disconnected',function(){
  console.log("Mongo Db disconnected")
})

router.get('/',function(req,res,next){
  Goods.find({},function(err,doc){
    console.log('hi')
    if(err){
      res.json({
        status:'1',
        msg:err.message
      })
    }else{
      res.json({
        status:'0',
        msg:'',
        result:{
          count:doc.length,
          list:doc
        }
      })
    }
  })
})


module.exports = router;