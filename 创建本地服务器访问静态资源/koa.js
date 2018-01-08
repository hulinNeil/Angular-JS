const Koa = require('koa');
const app = new Koa();
const path = require('path');
const serve = require('koa-static');
const main = serve(path.join(__dirname+'/public'));
app.use(main);
app.listen(3001,function(){
	console.log("应用实例，访问地址为http://127.0.0.1:3001")
});