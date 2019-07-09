# 通过微信公众平台提供的接口实现上传素材功能

## 上传语音

接口地址： https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=ACCESS_TOKEN&type=TYPE

参数：
1. access_token     调用接口凭证
2. type             媒体文件的类型
3. media            文件信息

步骤：
0. 通过在线接口调试工具来做简单演示。
1. 要获取 access_token， 它是调用 微信接口的唯一凭证。它有一些特征：
   1. 它每天只有2000次的调用次数
   2. 因为1, 所以要缓存它，它的有限时间是 2小时

  appId: wx9c1cc1eb2938caa8
  secret: f646388868da47de4f2faf86170bd7bd
  access_token: 23_qT9cNBwwzT9H0Z0hmVf4zjjLZly2gIUU7W_HW7pvGsfgCNghZt2jqvDUJ4IThe0qNFkbgz6Wdvs-w54p7btMjiM5PCAtgOZEok7xQXNplpyAHScIL40oJYkBhQXNPtUZBwqgFVEVlKPmcX5SXNXfAEANDN

2. 调用语音上传


