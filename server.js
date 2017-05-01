var Express = require('express');


var app = require('./webtask');
var server = Express();
var port = process.env.PORT || 3000;

server.use(app);

server.listen(port, function () {
    console.log('Server started on port', port);
});
