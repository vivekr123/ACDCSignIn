var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/loginapp');
var db = mongoose.connection;

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

app.set('views', path.join(__dirname,'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine','handlebars');

//BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

//Static Folder
app.use(express.static(path.join(__dirname,'public')));


//Express session
app.use(session({
  secret:'secret',
  saveUninitialized:true,
  resave:true
}));

//Passport initialization

app.use(passport.initialize());
app.use(passport.session());


app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//Connect Flash
app.use(flash());

//Global Vars
app.use(function(req,res,next){
  res.locals.success_msg = req.flash('success_mg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;                             //user exists
  next();
});

//Middleware for route files

//app.use('/',routes);         //goes to index
app.use('/users',users);      //goes to useres


//CHAT FUNCTIONALITY



//Set port

//app.set('port', (process.env.PORT || 8080));

var port = process.env.PORT || 8080;

/*app.listen(app.get('port'), function(){
  console.log('Server started on port '+app.get('port'));
}); */

//To keep track of online clients
var clients = [];
var clientsWithID = {};
var clientsWithUsername = {};

//Passed the express server to socket.io
var io = require('socket.io').listen(app.listen(port));

//Global username ?
var userNowName = '';
var userNowUsername = '';
var userNowId;

//Get Home page
app.get('/',ensureAuthenticated, function(req,res){

    userNowName = req.user.name;
    userNowUsername = req.user.username;

    res.render('index',{username: req.user.name});


  });

function ensureAuthenticated(req,res,next){

  if(req.isAuthenticated()){
    return next();
  }
  else{
    req.flash('error_msg', 'You are not logged in');
    res.redirect('/users/login');
  }

}

//Socket is the socket of a client
io.sockets.on('connection', function(socket){
  socket.name = userNowName;       //Might not work
  socket.username = userNowUsername;

  //Use one variable

  //To be encrypted
  //clientsWithID[socket.username] = socket.id;
  clientsWithUsername[userNowUsername] = {'name':socket.name, 'id':socket.id};

  /*if (performance.navigation.type == 1) {
    socket.emit('disconnect');
  } */
  if(clients.indexOf(userNowName) < 0) {
     (clients.push(socket.name))

   }

  //clients.push('Hi');
  socket.emit('message', { message: 'Welcome to the chat'});
  io.sockets.emit('currentClients', clients);
  socket.on('send', function(data){
    io.sockets.emit('message', data);
  })
  socket.on('disconnect', function(){
    console.log('Disconnected');
    clients.splice(clients.indexOf(socket.name), 1);
    /*if(clients.length > 1){ //in case only one user online
    io.sockets.emit('removeClient', socket.name);
  }*/
    io.sockets.emit('currentClients', clients);
    //Remove all instances of user in all sockets      ------>>>>> Needs to be implemented
  });


})
console.log("Listenting on port " + port);
