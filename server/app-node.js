var http_port = 8080;

var crypto = require('crypto');
var mysql = require('mysql');
var express = require('express');
var connconfig = {
	host: 'xw.cfjgm7a2aegj.us-east-1.rds.amazonaws.com',
	user: 'xiwan',
	password: '1q2w3e4R'
};


var app = express();

app.get('/', function(req, res){
	res.send('hello world');
});

app.get('/getuser', function(req, res){
	var q = req.query;
	var id = q.id;
	if (!id){
		res.end('no user id');
	}
	
	var connection = mysql.createConnection(connconfig);
	connection.connect();
	connection.query('USE toutou');
	var sqlGetUser = 'SELECT * FROM tt_user WHERE user_id='+id;
	connection.query(sqlGetUser, function(err, rows, fields){
		if (err) throw err;
		res.end( JSON.stringify(rows[0]) );
		connection.end();		
	});
});

app.get('/setuser',function(req, res){
	var q = req.query;
	var userName = q.name;
	var userPswd = '123456';
	var userFrom = q.from;
	var userSex = q.sex;
	var userLoc = q.loc;
	var userPhone = q.phone;

	if (!userName){
		res.end('no user name');
	}
	if (!userFrom){
		res.end('no from origin');
	}
	
	var connection = mysql.createConnection(connconfig);
	connection.connect();
	//handleDisconnect(connection);
	connection.query('USE toutou');
	
	var userId = 0;
	var sqlUpdateSeq = 'UPDATE seq_user SET id = id+1';
	var sqlUserSeq = 'SELECT * FROM seq_user';
	
	connection.query(sqlUpdateSeq, function(err, rows, fields){
		if (err) throw err;	
	});
	
	connection.query(sqlUserSeq, function(err, rows, fields){
		if (err) throw err;	
		userId = rows[0].id;
		if (userId){
			var insertUser = "INSERT INTO tt_user VALUES("+userId+", '"+userName+"', '"+userPswd+"', '"+userFrom+"', '', '"+userSex+"', '"+userPhone+"', '"+userLoc+"', UNIX_TIMESTAMP(),  	UNIX_TIMESTAMP())";
			connection.query(insertUser, function(err, rows, fields){
				if (err) throw err;
				connection.end();
				res.end( JSON.stringify({'id': userId}) );
			});
		}else {
			res.end("bad user id");
		}
	});
})

app.listen(http_port);
console.log('express app start at port: ' + http_port);

function md5 (text) {
  return crypto.createHash('md5').update(text).digest('hex');
}

function handleDisconnect(connection) {
  connection.on('error', function(err) {
    if (!err.fatal) {
      return;
    }

    if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
      throw err;
    }

    console.log('Re-connecting lost connection: ' + err.stack);

    connection = mysql.createConnection(connconfig);
    handleDisconnect(connection);
    connection.connect();
  });
}

