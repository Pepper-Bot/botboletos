var express =require("express"),
app=express(),
server=require('http').createServer(app),
cons= require('consolidate'),
path = require("path");
app.engine('.html',cons.jade);
app.set('view engine','html');

app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({secret: 'mi secreto'}));

app.use(express.static('./public'));

app.get('/',function  (req, res) {
  res.render("index");
});

app.post('/ver',function (req,res) {
  req.session.mivariable=req.body.nombre;
  res.render('ver',{Titulo:'Ver variable', Nombre:req.session.mivariable});
});
app.get('/ver',function (req,res) {
  if(typeof req.session.mivariable!='undefined'){
    res.render('ver',{Titulo:'Ver variable', Nombre:req.session.mivariable});
  }else{
    res.render('ver',{Titulo:'Ver variable', Nombre:'la variable no existe'});
  }
});
app.get('/cerrar',function (req,res) {
  delete req.session.mivariable;
  res.render('destruir');
});
server.listen(3000);