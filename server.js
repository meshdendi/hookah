const express = require('express');
const app = express();
const path_view = './public/views/';
const path = require('path');
const session = require('express-session');
const mongo = require('mongojs');
const db = mongo('Hookah');
var bodyParser = require('body-parser');
// var jquery = require('jquery');
// var bootstrap = require('bootstrap');
var sess = {
  secret: 'this is my secret',
  resave: true,
  saveUninitialized: false,
  cookie: {}
};

app.use(session(sess));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap



app.set('port', process.env.PORT || 3000);
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, path_view));



app.get('/',function(req, res){
   if (!req.session.isvalid){
      res.render('logon/login');
   }

});


app.post('/', function(req, res){
  username = req.body.username;
  password = req.body.password;

  db.emps.findOne({username: username, password:password}, function(err,docs){
    if (docs){
      req.session.isvalid = true;
      req.session.username = docs.username;
      res.send(req.session.username );
    }else{
      console.log('not found');
      res.render('logon/login', {err:'Wrong username of passwor'});
    }
  });
});


app.listen(app.get('port'), function(){
  console.log('listening to port 3000');
});
