const fs = require("fs");
const { Wechaty, Message } = require('wechaty');

// 获取项目相关信息
fs.readFile('package.json', function (err, data) {
  if (err) {
    return console.error(err);
  }
  let startString = `欢迎使用下咖微信机器人v ${JSON.parse(data).version}，请您扫码登录微信`;
  console.log(startString);
  startBot();
});

let lastSayTime = Date.parse(new Date());
let userId = '';
let helloUser = [];
function startBot() {
  Wechaty.instance() // Singleton
    .on('scan', (url, code) => console.log(`可点击链接进行扫码登录${url}`))
    .on('login',       user => {
      console.log(`用户${user}已登录成功`);
      console.dir(user);
      userId = user.id;
    })
    .on('message',  message => {
      let from = message.from();
      let rawObj = from.rawObj;
      console.dir(rawObj);
      let hello = `我今天刚开始动工一个微信机器人，现在正在测试，自动回复：你好，来自${rawObj.City}的${rawObj.NickName},你说：‘${rawObj.Signature}’`;
      // debugger;
      if (rawObj.UserName == userId || rawObj.IsOwner == undefined ||
        Date.parse(new Date()) - lastSayTime <= 10000 || helloUser.indexOf(rawObj.UserName) >= 0) {

        return ;
      }
      lastSayTime = Date.parse(new Date());
      helloUser.push(rawObj.UserName);
      message.say(hello);
    })
    .init();
}
