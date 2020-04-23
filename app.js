//var createError = require('http-errors');
var express = require('express');

var path = require('path');
var cookieParser = require('cookie-parser');

var http = require('http');

//Init express app and http server
var app = express();

var server = http.createServer(app);

var port = '3000';

app.set('port',port);



//Import js files in routs folder
//var indexRouter = require('./routes/index');
var bookRouter = require('./routes/books');


// view engine setup
/*app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
*/

//app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRouter);

app.use('/mybookstore', bookRouter);

// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
  next(createError(404));
});*/

// error handler
/*app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
*/
server.listen(port, function(err){
	if(err){
		console.log(err);
	}

	console.log('Server listening on PORT:::'+port);
});

//module.exports = app;
