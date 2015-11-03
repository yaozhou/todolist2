var express = require('express');
var app = express();

var mysql = require('mysql');
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database:'todolist',
    port: 3306
});

conn.connect();

app.use(express.static('static'));

app.get('/weather', function (req, res) {
  res.send('Hello World! route');
});


	

app.get('/message', function (req, res) {

	conn.query('SELECT * from t_message', function(err, rows, fields) {
    	if (err) throw err;
    	var message_list = ''
    	for (var i = 0; i < rows.length; i++) {
    		message_list += rows[i].name + '\n' ;
	    };
	    var str = JSON.stringify(rows) ;
	    console.log('The solution is: ', str) ;
	    res.send(str) ;
	}) ;
	
  	
});

// conn.end();





var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
