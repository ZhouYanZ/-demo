// 公用的一些函数文件
const xml2js = require("xml2js");
const sha1 = require("sha1");
const axios = require("axios");
const ConfModel = require("../models/conf");
const config = require("../config");
const parser = new xml2js.Parser();
const builder = new xml2js.Builder();
/**
 * 将 xml 转换成 JSON
 */
const xmlToJson = xml => {
  return new Promise((resolve, reject) => {
    parser.parseString(xml, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

/**
 * 将 json 转换成 xml
 */
const jsonToXml = json => {
  return builder.buildObject(json);
};

/**
 * 获取当前秒数
 */
const getNowTime = () => {
  return Math.floor(new Date().getTime() / 1000);
};

/**
 * 获取 access_token
 */
const getToken = async () => {
  // 0. 先取出数据库中的数据
  let data = await ConfModel.findOne({ onlyId: 1 });
  // 1. 判断数据库中是否有token，并且有没有过期
  if (data && data.token && data.tokenTime > getNowTime()) {
    console.log("没过期");
    // 没有过期, 直接使用 数据库存着的token
    return data.token;
  } else {
    console.log("过期了");
    // 过期了
    return new Promise((resolve, reject) => {
      let url = "https://api.weixin.qq.com/cgi-bin/token";
      axios
        .get(url, {
          params: {
            grant_type: "client_credential",
            appid: config.appid,
            secret: config.appsecret
          }
        })
        .then(response => {
          let res = response.data; // {access_token: '', expires_in: 7200}
          // 更新数据库
          ConfModel.updateOne(
            { onlyId: 1 },
            {
              token: res.access_token,
              tokenTime: getNowTime() + 7000
            },
            {
              upsert: true // 如果数据库中找不到 onlyId 为 1 的这条记录，就做创建。
            }
          )
            .then(data => {
              console.log(data);
            })
            .catch(error => {
              console.log(error);
            });

          resolve(res.access_token);
        });
    });
  }
};

/**
 * 获取 jsapi_ticket
 * @param {String} token access_token
 */
const getTicket = async token => {
  // 0. 先去出数据库中的数据
  let data = await ConfModel.findOne({ onlyId: 1 });
  if (data && data.ticket && data.ticketTime > getNowTime()) {
    // 没过期
    return data.ticket;
  } else {
    // 过期了
    return new Promise((resolve, reject) => {
      let url = "https://api.weixin.qq.com/cgi-bin/ticket/getticket";
      axios
        .get(url, {
          params: {
            access_token: token,
            type: "jsapi"
          }
        })
        .then(response => {
          let res = response.data;
          // {
          //   "errcode":0,
          //   "errmsg":"ok",
          //   "ticket":"bxLdikRXVbTPdHSM05e5u5sUoXNKd8-41ZO3MhKoyN5OfkWITDGgnr2fwJ0m9E8NYzWKVZvdVtaUgWvsdshFKA",
          //   "expires_in":7200
          //   }
          // 更新数据库
          ConfModel.updateOne(
            { onlyId: 1 },
            {
              ticket: res.ticket,
              ticketTime: getNowTime() + 7000
            },
            {
              upsert: true // 如果数据库中找不到 onlyId 为 1 的这条记录，就做创建。
            }
          )
            .then(data => {
              console.log(data);
            })
            .catch(error => {
              console.log(error);
            });
          resolve(res.ticket);
        });
    });
  }
};

/**
 * 生成一个随机的字符串
 */
const getNoncestr = () => {
  return Math.random()
    .toString(36)
    .substr(2, 15);
};

/**
 * 获取 签名算法
 * @param {String} url 参数签名的url地址
 */
const getSignature = url => {
  return new Promise(async (resolve, reject) => {
    // 1. 获取 token
    let token = await getToken();
    // 2. 根据 token 获取 ticket
    let ticket = await getTicket(token);
    // 3. 得到一个随机字符串
    let noncestr = getNoncestr();
    // 4. 得到一个时间戳
    let timestamp = getNowTime();

    // 5. 做字符串拼接
    let str = `jsapi_ticket=${ticket}&noncestr=${noncestr}&timestamp=${timestamp}&url=${url}`;

    // 6. 加密
    let signature = sha1(str);
    resolve({
      appId: config.appid,
      timestamp: timestamp,
      nonceStr: noncestr,
      signature: signature
    });
  });
};

// 将数据库conf那张表先做一条记录 这个可以不做
// let conf = new ConfModel(null);
// conf.save();

// 暴露
module.exports = {
  xmlToJson,
  jsonToXml,
  getSignature
};
