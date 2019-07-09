const xml2js = require("xml2js");

// 1. 将 xml 字符串转化为 JSON 对象
// let xml = "<root>我的天</root>";
// let parser = new xml2js.Parser();
// parser.parseString(xml, (error, result) => {
//   if (error) {
//     console.log("转化xml失败");
//   } else {
//     console.log(typeof result);
//   }
// });

// 2. 将 JSON 对象 转换为 xml 字符串
let result = { root: "我的天" };
let builder = new xml2js.Builder();
let xml = builder.buildObject(result);
console.log(xml);
