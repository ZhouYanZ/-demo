const express = require("express");
// 1. 引入 wechat 模块
const wechat = require("wechat");
const server = express();

// 2. 定义好配置
let config = {
  token: "weixin",
  appid: "wx9c1cc1eb2938caa8",
  encodingAESKey: "oKhSDJbFgu3RHYCy9b4pvZsJC1nJZ3UNw23cfURrXkc",
  checkSignature: true
};

server.get("/", (req, res) => {
  res.send("hello weixin");
});

// 3. 定义好路由
server.use(
  "/weixin",
  wechat(config, (req, res, next) => {
    // console.log()
    let message = req.weixin;
    console.log(message);
    if (message.MsgType === "voice") {
      res.reply({
        type: "voice",
        content: {
          mediaId: "yT-IWcgBt4RwUxDlD7x6kkSmkS2d8DBnCGlt6SXAldg"
        }
      });
    } else if (message.Content === "洗脚") {
      res.reply({
        type: "image",
        content: {
          mediaId: "yT-IWcgBt4RwUxDlD7x6kk9g9F5XXLcG54wqxJwvU_M"
        }
      });
    } else {
      res.reply(message.Content);
    }
  })
);

server.listen(9090);
