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