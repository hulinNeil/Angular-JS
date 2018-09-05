socket.io是封装websocket的框架，用于服务端与客户端的相互通讯。[官网:https://socket.io/](https://socket.io/);
### 下面是socket.io的用法：
- 1、由于使用express开的本地服务，先下载相关依赖
```
cnpm install express socket.io
```
- 2、服务端代码
```
const express = require("express");
const io = require("socket.io");
const app = express();

app.use(express.static('project'));
app.get('/index.htm', function (req, res) {
    res.sendFile(__dirname + "/" + "index.htm");
})
var server = app.listen(3000, function () {
    console.log("应用实例，访问地址为http://127.0.0.1:3000")
})

var sockets = io(server);//监听server
sockets.on("connection",function(socket){
	console.log("初始化成功！下面可以用socket绑定事件和触发事件了");
	socket.on("send",function(data){
		console.log("客户端发送的内容：",data);
		socket.emit("getMsg","我是返回的消息~~~~~~~");
	})
	setTimeout(function(){
		socket.emit("getMsg","我是初始化5s后返回的消息~~~~~~~");
	},5000)
});
```
- 3、客户端代码
```
<button id="send">发送消息到服务器</button>
<div>
	<p>服务器返回的消息是：</p>
	<i id="msg"></i>
</div>
<script src="socket.io.js"></script>
<script>
	var socket = io("ws://localhost:3000"); //初始化websocket，连接服务端
	var send = document.querySelector("#send"),
		msg = document.querySelector("#msg");
	send.onclick = function () {
		console.log("点击了发送消息！");
		socket.emit("send", "hello")
	}
	socket.on("getMsg", function (data) {
		console.log("服务端发送的消息是：", data);
		msg.innerHTML += data + '<br/>';
	})
</script>

```
- 4、执行
```
node index.js
```
