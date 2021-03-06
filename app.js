const mongoose=require('mongoose');
const bcrypt=require('bcryptjs')
var express = require('express');
var bodyParser=require("body-parser"); 
/* const userRouter = require('./user'); */

let app=require('express')( );
var LocalStrategy = require('passport-local').Strategy;
var router = express.Router();
var User=require('./model')
mongoose.connect('mongodb://localhost:27017/gfg'); 
var db=mongoose.connection; 
const passport=require('passport')
var flash=require("connect-flash");
app.use(flash());

let http=require('http').Server(app);
let io=require('socket.io')(http);
let fs=require('fs');
users=[];
connections=[];





 


//check connection
db.once('open',function(){
    console.log('Connected to MongoDB');
})
//check errors
db.on('error',function(err){
    console.log(err);
});

app.use(bodyParser.json()); 
app.use(express.static('public')); 
app.use(bodyParser.urlencoded({ 
    extended: true
})); 

//passport config

var expressSession = require('express-session');
app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user._id);
  });
   
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
  var isValidPassword = function(user, password){
    return bCrypt.compareSync(password, user.password);
  }
 

      // User and password both match, return user from 
      // done method which will be treated like success
    

  app.use(passport.initialize());
app.use(passport.session());

app.post('/sign_up', function(req,res){ 
     
    var email =req.body.email; 
    var pass = req.body.pass; 
    var fname =req.body.fname;
    var lname= req.body.lname; 
  
    var data = { 
         
        "email":email, 
        "password":pass, 
        "first_name":fname,
        "last_name":lname 
    } 
db.collection('details').insertOne(data,function(err, collection){ 
        if (err) throw err; 
        console.log("Record inserted Successfully"); 
              
    }); 
          
    return res.redirect('/'); 
}) 

app.get('/',function(req,res){
    res.sendFile(__dirname + '/views/index.html');
})

app.get('/login',function(req,res){
  res.sendFile(__dirname + '/views/index.html');
})

app.get('/blog',function(req,res){
  res.sendFile(__dirname + '/views/blog.html');
})
  
  // app.get('/welcome', ensureAuthenticated,function(req,res){
  //   res.sendFile('/welcome.html')
  // })

app.get('/registration',function(req,res){
    res.sendfile(__dirname+'/views/registration.html');
})

app.use('/static', express.static(__dirname + '/static'));

app.get('/welcome',(req,res)=>{
  res.sendfile(__dirname + '/views/welcome.html');
}) 
// app.get('/welcome',function(req,res){
//   res.sendfile('welcome.html');
// })

io.on('connection',(socket)=>{
  connections.push(socket);
  console.log('connected: %s sockets connected',connections.length);
   socket.on('disconnect',()=>{
      connections.splice(connections.indexOf(socket),1)
      console.log('Disconnected:%s sockets connected',connections.length);
  })
  //send message
  socket.on('send message',function(data){
      // console.log(data);
      io.sockets.emit('new message',{msg:data})
  });
  socket.on('send image',function(image){
      io.sockets.emit('addimage','',image)

  })
});

// http.listen(3000,()=>{
//   console.log('Connected')
// })
http.listen(3000,()=>{
    console.log('Server Running');
})