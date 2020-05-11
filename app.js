
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var http = require('http');
//API token
const morgan = require('morgan'),
jwt = require('jsonwebtoken'),
bodyParser = require('body-parser'),
config = require('./configurations/config');
const ProtectedRoutes = express.Router();


//Init express app and http server
var app = express();
var server = http.createServer(app);
var port = '3000';
app.set('port',port);


//API token
app.use(morgan('dev'));
app.set('Secret', config.secret);
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


//set up authentication
app.post('/authenticate', function(req, res){

  if(req.body.username === "mahendra"){
    if(req.body.password === "123"){
        const payload = {
          check: true
        };

        var token = jwt.sign(payload, app.get('Secret'), {
          expiresIn: 1440 //expires in 24 hours
        });

        res.json({
          message: 'authentication done',
          token: token
        });
    } else{
      res.json({
        message: "Please check your password!!!"
      })
    }
  }else{
    res.json({
      message: "User not found!!!"
    })
  }

});


//Middleware routes
app.use("/api", ProtectedRoutes);
ProtectedRoutes.use(function(req, res, next){
  //check header for token
  var token  = req.headers['access-token'];

  //decode token
  if(token){
    //verify secret and check if token has expired
    jwt.verify(token, app.get('Secret'), function(err, decoded){
      if(err){
        return res.json({message:"Invalid token"});
      }else{
        //if every thing is good , save to request for other routes
        req.decoded = decoded;
        next();
      }
    })

  }else{

    //if no token
    res.json({message: "No Token Provided!!!"})
  }
});

ProtectedRoutes.get('/getproducts', function(req,res){

  res.json({
    "products": req.decoded
  })

});


app.get('/', function(req, res){
  res.send("Welcome to My-Book-Store");
});

var bookRouter = require('./routes/books');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/mybookstore', bookRouter);

server.listen(port, function(err){
	if(err){
		console.log(err);
	}

	console.log('Server listening on PORT:::'+port);
});

