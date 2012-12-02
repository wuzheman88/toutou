var http_port = 8080;
var express = require('express');
var app = express();

app.get('/', function(req, res){
  res.send('hello world');
});

app.listen(http_port);

console.log('express app start at port: ' + http_port)