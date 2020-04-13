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
		next();		
	});

});

/*POST call to insert data in bookmaster*/
router.post('/addbookmaster',function(req,res,next){
	if(req.body !== null && typeof req.body == 'object'){
		let reqKeys =[];
		let reqValues = [];
		for(key in req.body){
			reqKeys.push(key);
			reqValues.push(req.body[key]);
		}
		let queryString = 'INSERT INTO all_books.book_master('+reqKeys[0]+', '+reqKeys[1]+', '+reqKeys[2]+', '+reqKeys[3]+') VALUES ('+'\''+reqValues[0]+'\', \''+reqValues[1]+'\', \''+reqValues[2]+'\', \''+reqValues[3]+'\');';
		res.status(200).send(queryString);
	}else{
		res.status(400).send("Invalid request body");
	}

});

module.exports = router;
