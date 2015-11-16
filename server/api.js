var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var paginate = require('express-paginate');
var app = express();

db = mongoose.connect("rejns:a1s2d3f4@ds045604.mongolab.com:45604/app-data");

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

//this way we do not expose our server directory structure
app.use(express.static(__dirname+'/../app/src'));
app.use('/components', express.static(__dirname+'/../app/src/components/create/'));
app.use('/components', express.static(__dirname+'/../app/src/components/login/'));
app.use('/components', express.static(__dirname+'/../app/src/components/register/'));
app.use('/components', express.static(__dirname+'/../app/src/components/home/'));
app.use('/components', express.static(__dirname+'/../app/src/components/list/'));
app.use('/components', express.static(__dirname+'/../app/src/components/details/'));
app.use('/components', express.static(__dirname+'/../app/src/components/header/'));
app.use('/components', express.static(__dirname+'/../app/src/reusable/interceptor/'));
app.use('/components', express.static(__dirname+'/../app/src/reusable/models/post/'));
app.use('/components', express.static(__dirname+'/../app/src/reusable/models/user/'));
app.use('/components', express.static(__dirname+'/../app/src/reusable/pagination/'));
app.use('/components', express.static(__dirname+'/../app/src/reusable/posts/'));
app.use('/components', express.static(__dirname+'/../app/src/reusable/security/'));
app.use('/css', express.static(__dirname+'/../app/assets/css'));
app.use('/scripts', express.static(__dirname+'/../bower_components/angular/'));
app.use('/scripts', express.static(__dirname+'/../bower_components/angular-route/'));
app.use('/scripts', express.static(__dirname+'/../bower_components/ngstorage/'));
app.use('/scripts', express.static(__dirname+'/../bower_components/angular-resource/'));
app.use('/scripts', express.static(__dirname+'/../bower_components/ngInfiniteScroll/build/'));
app.use('/scripts', express.static(__dirname+'/../bower_components/jquery/dist/'));
app.use('/scripts', express.static(__dirname+'/../bower_components/bootstrap/dist/js/'));
app.use('/assets', express.static(__dirname+'/../bower_components/bootstrap/dist/css/'));

app.use(paginate.middleware(10, 50));

var userRouter = require('./models/user/routes.js');
var postRouter = require('./models/post/routes.js');

//api routes, each router is like a small express app which provides certain api  
//root route only returns index.html and then angular takes care of routing
app.use('/api/authenticate', userRouter);
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.get('/', function(req, res) {
	var path = require('path');
	res.sendFile(path.resolve(__dirname+'/../app/index.html'));
});

app.listen(3000);