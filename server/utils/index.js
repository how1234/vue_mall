function getJsonFile(success,msg,data){
  let json = {
    status: success ? "0":"1",
    msg:msg,
    data:data

  }
  return json
}



module.exports = {
  getJsonFile
}