const Mock = require('mockjs')
const utils = require('./utils')

module.exports = function(app){
  app.get('/api/goodsInfo',function(req,res){
    var data = utils.readJsonFile('./goodsInfo.json')
    res.json(Mock.mock(data))
  })
}