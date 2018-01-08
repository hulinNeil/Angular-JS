#使用node建立本地服务器访问静态文件
```
demo
│   node_modules
└───public
│   │   index.html
│   │   index.css
│   └───index.js
└───server.js
```
##一、使用express框架的示例
1.下载express依赖
```
cnpm install express
```
2.server.js代码
```
//server.js
var express = require('express');
var app = express();

app.use(express.static('public'));//express.static是express提供的内置的中间件用来设置静态文件路径

app.get('/index.htm', function (req, res) {
    res.sendFile(__dirname + "/" + "index.htm");
})

var server = app.listen(3000, function () {
    console.log("监听3000端口")
})
```
3.public目录里面的index.html、index.css、index.js （其他几个方法公用这个文件夹的面问资源文件）
```
//index.html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title>本地服务器</title>
		<meta charset="UTF-8" />
		<link rel="stylesheet" type="text/css" href="index.css"/>
		<script src="index.js" type="text/javascript" charset="utf-8"></script>
	</head>
	<body>
		<h3>本地服务器</h3>
	</body>
</html>
//index.css
body{
	background: #fff000;
}
//index.js
console.log("index.html加载了index.js")
```
4.运行
```
node server.js
```
##二、使用koa框架的示例
1.安装koa koa-static
```
cnpm install koa koa-static
```
注意：koa要求node的版本较高(node v7.6.0+)，如果出现如下错误，要升级node
```
koa-static@4.0.1@koa-static\index.js:39
return async function serve (ctx, next) {
             ^^^^^^^^
SyntaxError: Unexpected token function
```
2.server.js代码如下
```
const Koa = require('koa');
const app = new Koa();
const path = require('path');
const serve = require('koa-static');

const main = serve(path.join(__dirname+'/public'));
app.use(main);

app.listen(3001,function(){
	console.log("监听3001端口")
});
```
##三、使用fastify框架的示例
1.安装fastify serve-static
```
cnpm install fastify serve-static
```
2.server.js代码如下
```
const serveStatic = require('serve-static');
const fastify = require('fastify')();
const path = require('path');

fastify.use('/', serveStatic(path.resolve(__dirname, 'public')));

fastify.listen(3002, function () {
    console.log("监听3002端口");
})
```
##三、不使用框架的示例
server.js(不需要引入任何第三方依赖)
```
var url = require("url"),
    fs = require("fs"),
    http = require("http"),
    path = require("path");
http.createServer(function (req, res) {
    var pathname = __dirname + url.parse("/public"+req.url).pathname;//资源指向public目录
    if (path.extname(pathname) == "") {
        pathname += "/";
    }
    if (pathname.charAt(pathname.length - 1) == "/") {
        pathname += "index.html";
    }
    fs.exists(pathname, function (exists) {
        if (exists) {
            switch(path.extname(pathname)){
                case ".html":
                    res.writeHead(200, {"Content-Type": "text/html"});
                    break;
                case ".js":
                    res.writeHead(200, {"Content-Type": "text/javascript"});
                    break;
                case ".css":
                    res.writeHead(200, {"Content-Type": "text/css"});
                    break;
                case ".gif":
                    res.writeHead(200, {"Content-Type": "image/gif"});
                    break;
                case ".jpg":
                    res.writeHead(200, {"Content-Type": "image/jpeg"});
                    break;
                case ".png":
                    res.writeHead(200, {"Content-Type": "image/png"});
                    break;
                default:
                    res.writeHead(200, {"Content-Type": "application/octet-stream"});
            }
            fs.readFile(pathname, function (err, data) {
                res.end(data);
            });
        } else {
            res.writeHead(404, {
                "Content-Type": "text/html"
            });
            res.end("<h1>404 Not Found</h1>");
        }
    });
}).listen(3003);
console.log("监听3003端口");

```