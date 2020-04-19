var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.json());

//make connection to postgres DB
const { Client } = require('pg');
const connectionString = 'postgres://postgres:admin@localhost:5432/books';
const client = new Client({
	connectionString: connectionString
});
client.connect();


/* GET all records from DB Table 'all_books.book_master' */
router.get('/allbooks', function(req, res, next) {
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

/*POST call to insert data in bookmaster*/
router.post('/addbookmaster',function(req,res,next){
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
router.post('/addbookmaster-bulk', function(req,res,next){
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

module.exports = router;
