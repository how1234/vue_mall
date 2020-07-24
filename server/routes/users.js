
var express = require('express');
var router = express.Router();
const {getJsonFile} = require('../utils/')
var User = require('./../models/users')

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

router.post('/login',function(req,res){
  var param = {
    userName:req.body.userName,
    userPwd:req.body.userPwd
  }
  User.findOne(param, (err,doc) =>{
    if(err){  
      res.json(getJsonFile(false,"login fail",null))
    }else{
      if(doc){
        
        if(req.cookies !== doc.userId){
          res.cookie("userId",doc.userId,{
            path:'/',
            maxAge:1000 * 60 * 60
          });
        }
      
  
      
  
        let result = {
          userName:doc.userName
        }
        res.json(getJsonFile(true,"login success",result))
      }else{
        res.json(getJsonFile(false,"user is not existed",null))
      }
     
    }
  })
})
module.exports = router;
