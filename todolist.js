var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var util = require('util') ;

//create table t_item (id INT auto_increment, item varchar(1024), category int, primary key(id)) DEFAULT CHARSET=utf8;
//create table t_category (id int auto_increment, category varchar(1024), primary key(id)) DEFAULT CHARSET=utf8;

var mysql = require('mysql');

function query(sql, fun) {

	var conn = mysql.createConnection({
	    host: 'localhost',
	    user: 'root',
	    password: 'na',
	    database:'todolist',
	    port: 3306
	});

	conn.connect();   
	conn.query(sql, fun) ;
	conn.end() ;
}

query("SET character_set_client=utf8,character_set_connection=utf8") ;

app.use(express.static('static'));

app.use(bodyParser.json('1mb'));  //body-parser 解析json格式数据
app.use(bodyParser.urlencoded({            //此项必须在 bodyParser.json 下面,为参数编码
  extended: true
}));

app.post('/api/item_list', function (req, res) {
	query('SELECT * from t_item', function(err, rows, fields) {
    	if (err) throw err;
    	
	    var str = JSON.stringify(rows) ;
	    res.send(str) ;
	}) ;
});


app.post('/api/item_add', function(req, res) {
	var sql = util.format('INSERT INTO t_item(item, category) VALUES ("%s",%d);',
				req.body.item, req.body.category) ;
	console.log("add message(" + sql + ")") 

	query(sql, function(err, rows, fields) {
		if (err) throw err ;
		// console.log(JSON.stringify(rows)) ;
		res.send(JSON.stringify({"code":0, "item_id":rows.insertId, "category_id": req.body.category})) ;
	})
}) ;

app.post('/api/item_del', function(req, res) {
	var sql = "DELETE FROM t_item where id = " + req.body.id + ";" ;
	console.log("del message(" + sql + ")") ;

	query(sql, function(err, rows, fields) {
		if (err) throw err ;
		res.send(JSON.stringify({"code":0, "id":req.body.id})) ;
	})
})

app.post('/api/category_add', function(req, res) {
	var sql = "INSERT INTO t_category (category) VALUES ('" + req.body.category + "');" ;
	console.log("sql:" + sql) ;
	query(sql, function(err, rows, fields) {
		if (err) throw err ;
		res.send(JSON.stringify({"code":0, "id":rows.insertId, "name":req.body.category})) ;
	})
}) ;

app.post('/api/category_del', function(req, res) {
	var sql = "DELETE FROM t_category where id = " + req.body.id + ";" ;
	query(sql, function(err, rows, fields) {
		if (err) throw err ;
		res.send(JSON.stringify({"code" : 0, "id":req.body.id})) ;
	})
}) ;

app.post('/api/category_list', function(req, res) {
	var sql = "select * from t_category" ; 
	query(sql, function(err, rows, fields) {
		if (err) throw err ;
		res.send(JSON.stringify(rows)) ;
	})
}) ;

app.post('/api/table_query', function(req, res) {
	var sql = "select * from " + req.body.name + " ;" ;
	query(sql, function(err, rows, fields) {
		if (err) throw err ;
		res.send(JSON.stringify(rows)) ;
	}) ;
}) ;

var server = app.listen(3001, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
