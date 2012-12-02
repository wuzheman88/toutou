var http_port = 8080;
var mysql = require('mysql');
var connection = mysql.createConnection({
	host: 'xw.cfjgm7a2aegj.us-east-1.rds.amazonaws.com',
	user: 'xiwan',
	password: '1q2w3e4R'
});

var express = require('express');
var app = express();

app.get('/', function(req, res){
	res.send('hello world');
});

app.get('/getusr', function(req, res){
	var query = req.query;
	res.send('ok');
});

app.get('setuser',function(req, res){
	var q = req.query;
	var userName = q.name;
	var userPswd = '123456';
	var userFrom = q.from;
	var userSex = q.sex;
	var userLoc = q.loc;
	var userPhone = q.phone;

	var insertUser = "INSERT INTO tt_user VALUES(1, \'"+userName+"\', '123456', \'"+userFrom+"\', \'\', \'"+userSex+"\', \'"+userPhone+"\', \'"+userLoc+"\', UNIX_TIMESTAMP(),  UNIX_TIMESTAMP())"
	
	connection.connect();
	connection.query('USE toutou');
	connection.query(insertUser, function(err, rows, fields){
		if (err) throw err;
	});
	connection.end();
})

app.listen(http_port);
console.log('express app start at port: ' + http_port)