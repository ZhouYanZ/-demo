# jssdk

前端在公众号开发的流程，需要做的事情，就是开发网页，然后这个网页是通过 微信 这个 app 打开的。。
那么 我们做的 网页是可以调取 微信提供的一些功能点的。比如说

1. 设置分享。。。网页只要是在微信中打开，就可以使用微信的分享功能。但是不能自定义分享内容。

## 实现震惊了，惊呆了等风向功能

1. 绑定js接口安全域名
  先登录微信公众平台进入“公众号设置”的“功能设置”里填写“JS接口安全域名”。

2. 在需要使用jssdk的页面上，引入 jssdk 文件，引入之后就提供了一个 wx 这个对象

3. 使用 wx.config 来做配置

  wx.config({
    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: '', // 必填，公众号的唯一标识
    timestamp: , // 必填，生成签名的时间戳
    nonceStr: '', // 必填，生成签名的随机串
    signature: '',// 必填，签名
    jsApiList: [
      'chooseImage',
    ] // 必填，需要使用的JS接口列表
  });

## 通过 node js 实现 jssdk 签名

  access_token 是公众号开发调用公众号接口的唯一票据。
  jsapi_ticket 是公众号用于调用微信JS接口的临时票据。

1. 先获取 access_token
2. 根据 access_token 请求 jsapi_ticket
3. 实现签名的算法
  3.1 需要用到的数据有：
    3.1.1. noncestr 随机字符串 自己实现
    3.1.2. jsapi_ticket
    3.1.3. timestamp 时间戳
    3.1.4. url 哪个网页需要调用jssdk的接口，这个url地址就是那个网页的url地址。url地址中不能包含#已经#后面的部分

  3.2 将上面的四个参数做字典序排序（按参数名来做排序）组成key=value&key=value的字符串格式

  3.3 将3.2得到的字符串，做 sha1 加密，加密只有的字符串就是签名。

4. 写你的页面去吧。

## 获取 access_token

1. 缓存可以存到 mongodb 里面
