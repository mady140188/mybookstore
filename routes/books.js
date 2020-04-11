var express = require('express');
var router = express.Router();
const { Client } = require('pg');
const connectionString = 'postgres://postgres:admin@localhost:5432/books';
const client = new Client({
	connectionString: connectionString
});
client.connect();


/* GET users listing. */
router.get('/allbooks', function(req, res, next) {
	client.query('SELECT * FROM all_books.book_master',[0],
	function(err, result){
		if(err){
			console.log(err);
			res.status(400).send(err);
		}else{
			res.status(200).send(result.rows);	
		}

		
	});
  //res.send('Will get all books');
});

module.exports = router;
