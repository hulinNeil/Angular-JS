//1.先练接手机，得到像素，截图，开启服务
class wx_jump {
	constructor() {
		this.api = {
			exec:require('child_process').exec,
			express:require("express"),
			path:require("path"),
			socketIo:require("socket.io"),
			// adbPath:"D:\\HBuilder\\tools\\adbs\\adb.exe"
			adbPath:"D:\\HBuilder-alpha\\HBuilder\\tools\\adbs\\adb.exe"
		}
		
		this.wmSize().then((size)=>{
			this.createServer(size.data);
		}).catch((error)=>{
			console.log(error.msg);
			console.log('请检查手机是否已经成功连接电脑并已经开启USB调试模式')
		});
		
	}
	createServer(size) {
		let express = this.api.express,
			app = express(),
			socketIo = this.api.socketIo,
			exec = this.api.exec;
			
		app.use(express.static('project'));
		app.get("/index.html",(req,res)=>{
			res.sendFile(__dirname + "/" + "index.htm");
		});
		let server = app.listen(3000,()=>{
			console.log("访问地址为http://127.0.0.1:3000");
			exec("start http://127.0.0.1:3000");
		});
		
		let io = socketIo(server);//监听服务
		io.on("connection",(socket)=>{//连接成功
			socket.emit("size",size);//返回size
			this.socket(socket);//前往socket
		})
	}
	socket(socket) {//和前端要发生的事情都写在这里面，主要是截图，传递size
		this.screencap().then((data)=>{
			socket.emit("reloadImg",data.status);
		}).catch((error)=>{
			console.log(error.msg);
		});
		socket.on("submit",(data)=>{
			let time = data.time
			this.jump(time).then((data)=>{
				setTimeout(()=>{
					this.screencap().then((data)=>{
						socket.emit("reloadImg",data.status);
					}).catch((error)=>{
						console.log(error.msg);
					});
				},(time+300))
			}).catch((error)=>{
				console.log(error.msg);
			});
		})
	}
	adb(command) {
		// console.log("执行adb命令"+command)
		let options = process.argv,
			adbPath = this.api.adbPath,
			exec = this.api.exec;
		return new Promise((resolve, reject) => {
			exec(adbPath+" "+command, function(error, stdout, stderr) {
				if(error) {
					reject({
						status:"error",
						msg:`执行 ${command} 失败`,
						data:error
					})
				}else{
					resolve({
						status:"success",
						msg:`执行 ${command} 成功`,
						data:{
							stdout:stdout,
							stderr:stderr
						}
					});
				}
			});
		})
	}
	jump(time) {
		return new Promise((resolve, reject) => {
			let coordinate = "";
			for (let i=0;i<2;i++) {
			   coordinate += Math.floor(Math.random()*800) + ' ';
			}
			coordinate += coordinate;
			this.adb("shell input swipe " + coordinate + ' ' + time).then((data) => {
				resolve({
					status:"success",
					msg:'模拟点击成功',
					data:data
				})
			}).catch((error) => {
				reject({
					status:"error",
					msg:'模拟点击失败:' + error.msg,
					data:error.data
				})
			})
		})
	}
	screencap() {
		return new Promise((resolve, reject) => {
			this.adb("shell /system/bin/screencap -p /sdcard/screenshot.png").then((data) => {
				let imgPath = this.api.path.join(__dirname,"./project/img/screenshot.png");
				this.adb(`pull /sdcard/screenshot.png ${imgPath}`).then((data) => {
					resolve({
						status:"success",
						msg:'上传截图成功',
						data:data
					})
				}).catch((error) => {
					reject({
						status:"error",
						msg:'上传截图失败:' + error.msg,
						data:error.data
					})
				})
			}).catch((error) => {
				reject({
					status:"error",
					msg:'截图失败:' + error.msg,
					data:error.data
				})
			})
		})
	}
	wmSize() {
		return new Promise((resolve, reject) => {
			this.adb("shell wm size").then((data) => {
				let value = data.data.stdout.match(/\d+/ig);
				resolve({
					status:"success",
					msg:'屏幕分辩率成功',
					data:{
						width:value[0],
						height:value[1]
					}
				})
			}).catch((error) => {
				reject({
					status:"error",
					msg:'屏幕分辩率获取出错:' + error.msg,
					data:error.data
				})
			})
		})
	}
}
new wx_jump();