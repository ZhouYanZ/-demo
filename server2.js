const express = require("express");
const utils = require("./utils");
// 1. 引入 wechat 模块
const wechat = require("wechat");
const server = express();

// 2. 定义好配置
let config = {
  token: "weixin",
  appid: "wx30e6b0928b9c4e87",
  // encodingAESKey: "oKhSDJbFgu3RHYCy9b4pvZsJC1nJZ3UNw23cfURrXkc",
  checkSignature: true
};

server.use(express.static("public"));
// 3. 定义好路由
server.use(
  "/weixin",
  wechat(config, (req, res, next) => {
    res.reply("123");
  })
);

// 提供给前端获取 wx.config 需要参数的接口
server.get("/signature", async (req, res, next) => {
  // 1. 拿到前端传递过来的url地址
  let url = req.query.url;
  let data = await utils.getSignature(url);
  console.log(data);
  res.send(data);
});

server.listen(9090);
