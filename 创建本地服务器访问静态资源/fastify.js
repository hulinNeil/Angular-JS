const serveStatic = require('serve-static');
const fastify = require('fastify')();
const path = require('path');

fastify.use('/', serveStatic(path.resolve(__dirname, 'public')));

fastify.listen(3002, function () {
    console.log("监听3002端口");
})
