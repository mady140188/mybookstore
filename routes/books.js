var express = require('express');
var router = express.Router();

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

module.exports = router;
