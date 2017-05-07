var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var styles = require('stylus');
var SVG = require('svg.js');
var xmlParse = require('xml2js').parseString;

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

//make process trackable
process.title = "ariesApp";

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//handle submitted tile edit requests
app.post('/edit',function(req,res){
	
	var xcoord = parseInt(req.body.xcoord);
	var ycoord = parseInt(req.body.ycoord);
	console.log(xcoord);
	console.log(ycoord);
	var rawSVG = req.body.svg;
	if (!(Number.isInteger(xcoord)&&Number.isInteger(ycoord))){
		res.status(511).send("Tile coordinates invalid or out of bounds.");
		console.log("Tile coordinates invalid or out of bounds.");
		return;
	}
	if (!isValidSvg(rawSVG)){
		res.status(511).send("Invalid SVG string.");
		console.log("Invalid SVG string.");
		return;
	}
	console.log(req.body);
	//package is well-formed
	res.sendStatus(200);
	//TO DO: check previous password or one-time token (avoid edit spoofing and fabrication)
	//package into a mongoDB query
	return;
});

app.use('/', index);
app.use('/users', users);

//HELPER FUNCTION FOR SVG VALIDITY
function isValidSvg(svgString){
	console.log("in svg call");
	//parse and see if there are any errors
	var xmlObject = xmlParse(svgString,function(err,result){
			console.log("pre fancy log");
			console.log(util.inspect(result,false,null));
			console.dir(err);
			if (err) {
				console.log("returning false");
				return false;
			}
			else {
				console.log("legit svg");
				return true;
			}
	});
	//if invalid xml return false
	if (!xmlObject){
		console.log("false return");
		return false;
	}
	//if invalid group headers return false
	//else return true
	else {
		console.log("true return");
		return true;
	}
}



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
