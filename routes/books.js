var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const dbUtils = require('../utils/db_utils.js');


router.use(bodyParser.json());

//make connection to postgres DB
const { Client } = require('pg');
const client = new Client({
	connectionString: dbUtils.pgConnectionString
});
client.connect();


/* GET all records from DB Table 'all_books.book_master' */
router.get('/getbooks', function(req, res, next) {
	client.query('SELECT * FROM all_books.book_master',
	function(err, result){
		if(err){
			console.log(err);
			res.status(400).send(err);
		}else{
			res.status(200).send(result.rows);	
		}
		//client.end()	
	});

});

/*GET book buy book_id from book_master table*/
router.get('/getbook/:bookId', function(req, res){
	
	let bookQuery = "SELECT * FROM all_books.book_master WHERE book_id=\'"+req.params.bookId+"\'";
	
	client.query(bookQuery, function(err, result){
		if(err){
			res.status(400).send(err.detail);
		}else{
			res.status(200).send(result.rows);

		}

	})
});

/*POST call to insert data in bookmaster*/
router.post('/addbook',function(req,res,next){
		if(req.body == null || typeof req.body != 'object'){
			res.status(400).send("Invalid request body");
		}
		let reqKeys =[];
		let reqValues = [];
		for(key in req.body){
			reqKeys.push(key);
			reqValues.push(req.body[key]);
		}
		let queryString = 'INSERT INTO all_books.book_master('+reqKeys[0]+', '+reqKeys[1]+', '+reqKeys[2]+', '+reqKeys[3]+') VALUES ('+'\''+reqValues[0]+'\', \''+reqValues[1]+'\', \''+reqValues[2]+'\', \''+reqValues[3]+'\');';
		
		client.query(queryString,function(err, result){
			if(err){
				res.status(400).send(err.detail);
			}else{
				res.status(201).send("Book added successfully");
			}
		});
});

/* POST bulk insert into bookmaster table*/
router.post('/addbooks', function(req,res,next){
	if(req.body == null || !Array.isArray(req.body)){
		res.status(400).send("Invalid Request"); 
	}
	let book_author = "book_author";
	let book_id = "book_id";
	let book_name = "book_name";
	let book_price = "book_price";
	let queryStart = 'INSERT INTO all_books.book_master ('+book_author+', '+book_id+', '+book_name+', '+book_price+') VALUES '; 
	let values = ""; 
		for(let i=0;i<req.body.length;i++){
		if(values !== ""){
			values = values + ',';	
		}	
		values = values + '(\''+req.body[i][book_author]+'\', \''+req.body[i][book_id]+'\', \''+req.body[i][book_name]+'\', \''+req.body[i][book_price]+'\')';
	}
	let allQuery = queryStart+values+";";
	client.query(allQuery, function(err, result){
		if(err){
			res.status(400).send(err.detail);
		}else{
			res.status(201).send("Bulk Books Added successfully");
		}
	});
});

/*Delete query to delete records from book_master*/
router.delete('/deletebook/:bookId', function(req, res){

	let delQuery = "DELETE FROM all_books.book_master WHERE book_id=\'"+req.params.bookId+"\'";

	client.query(delQuery, function(err, result){
		if(result.rowCount == 0){
			res.status(400).send("Book Id not present in Database");
		}else{
			res.status(200).send("Book deleted successfully");
		}
	})
});

/*Update single book in book_master*/
router.patch('/updatebook/:bookId', function(req, res){
	if(req.body == null || !(typeof req.body == 'object')){
		res.status(400).send("Invalid Requset");
	}

let valueStr = "";
	for(let key in req.body){

		if(key == 'book_author'){
			valueStr += "book_author=\'"+req.body[key]+"\', ";
		}

		if(key == 'book_name'){
			valueStr += "book_name=\'"+req.body[key]+"\', ";
		}

		if(key == 'book_price'){
			valueStr += "book_price=\'"+req.body[key]+"\', ";
		}
	}

	valueStr  = valueStr.substring(0, valueStr.length - 2);
	

	let updateQuery = "UPDATE all_books.book_master SET "+valueStr+" WHERE book_id=\'"+req.params.bookId+"\'";
	
	client.query(updateQuery, function(err, result){

		if(result.rowCount == 0){
			res.status(400).send("Invalid book_id");
		}else{
			res.status(200).send("Book Updated successfully");
		}
	})
});

module.exports = router;
