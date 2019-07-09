const express = require("express");
const sha1 = require("sha1");
const { xmlToJson, jsonToXml } = require("./utils/index");
const server = express();

server.get("/", (req, res) => {
  res.send("hello weixin");
});

// http://localhost:9090/weixin => http://ix78vf.natappfree.cc/weixin
// 这个地址提供给微信接入指南
// 这块代码里面还需要做一些校验的工具
// 当我们点击提供确定按钮的时候，微信的服务器会给我们这个url地址发送http请求，并且会携带一些参数过来。
// 1. signature
// 2. timestamp
// 3. nonce
// 4. echostr

// 我们需要做的事情，是按照文档上的规则来做校验
server.get("/weixin", (req, res) => {
  // 0 获取微信传递过来的参数
  let signature = req.query.signature;
  let timestamp = req.query.timestamp;
  let nonce = req.query.nonce;
  let echostr = req.query.echostr;
  let token = "weixin";

  // 1 将token、timestamp、nonce三个参数进行字典序排序
  let tmpArr = [token, timestamp, nonce];
  tmpArr.sort();

  // 2 将三个参数字符串拼接成一个字符串进行sha1加密
  let str = tmpArr.join("");
  str = sha1(str);

  // 3 判断 str 是否与 signature 相同
  if (str === signature) {
    res.send(echostr);
  } else {
    res.send("你要干什么");
  }
});

server.post("/weixin", (req, res) => {
  console.log("用户发信息来了");
  // 1. 接收用户的消息内容  这时的数据是  xml 数据，所以不能使用 req.body 获取。
  let buf = "";
  req.on("data", chunk => {
    buf += chunk;
  });

  req.on("end", async () => {
    // console.log(buf);
    // buf是一个 xml 的数据格式，每个字段的意思，https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140453 文档中，消息管理，接收普通消息那块
    // res.send(buf); // 这块能否直接将这个消息回转给用户？

    try {
      let json = await xmlToJson(buf);
      console.log(json);

      // 将 josn 中的 ToUserName FromUserName 的值做一个跳转
      let ToUserName = json.xml.FromUserName;
      let FromUserName = json.xml.ToUserName;
      json.xml.ToUserName = ToUserName;
      json.xml.FromUserName = FromUserName;

      res.send(jsonToXml(json));
    } catch (error) {
      console.log("出错了", error);
    }
  });

  // 2. 返回消息 也需要 xml 格式的数据
});

server.listen(9090);
