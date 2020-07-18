const fs = require('fs')
const path = require('path')

module.exports = {
  readJsonFile: function(filePath){
    var data = fs.readFileSync(path.resolve(__dirname,filePath),'utf-8')
    return JSON.parse(data)
  }
}