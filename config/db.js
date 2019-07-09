// 链接 MongoDB
const mongoose = require("mongoose");
const url = "mongodb://127.0.0.1:27017/lv-weixin";

mongoose
  .connect(url, { useNewUrlParser: true })
  .then(() => {
    console.log("数据库链接成功 ✅");
  })
  .catch(error => {
    console.log("数据库链接失败 ❎");
    console.log(error);
  });

module.exports = mongoose;
