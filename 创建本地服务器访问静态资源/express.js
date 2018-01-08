var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/index.htm', function (req, res) {
    res.sendFile(__dirname + "/" + "index.htm");
})

var server = app.listen(3000, function () {
    console.log("应用实例，访问地址为http://127.0.0.1:3000/index.html")
})
