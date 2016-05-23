var express = require("express");
var bodyParser = require("body-parser");
var User = require("./models/user").User;//llamamos al Schema, librerias
//var session = require("express-session");
var cookieSession = require("cookie-session");
var router_app = require("./routes_app");
var app = express();
var session_middleware = require("./middlewares/session");


/*montamos los middlewares*/
/*para montar un middlewares hay que pasarlo como parámetro al método "use" 
sobre el objeto "app" que se crea cuando ejecutamos la función "express()"
archivos estáticos o  static: imagenes, css , javascript. (no presenta compilación
por parte del servidor, y por ello se llaman estático y van en una carpeta)
por defecto se utiliza la carpeta 'public' pero puede generan tantas carpetas 
necesitas para crear/guadar archivos estáticos.*/
app.use("/public",express.static('public'));  
app.use(express.static('assets'));  

app.use(bodyParser.json());// para peticiones application/json
app.use(bodyParser.urlencoded({extended: true})); 
/* /app */


app.use(cookieSession({
	name: "session",
	keys: ["llave-1","llave-2"]

}));
/*
app.use(session({
	secret: "123byuhbsdah12ub",
	resave: false, //ver video 25
	saveUninitialized: false
}));
*/
/*true o el false define el olgaritmo con que se va hacer el parsing la libreria,
si el 'false' no se puede hacer parsing de array o parámetro que se envian de una 
peticón get o post que no sean JSON*/
/*"body-parser" buscar los archivos dentro de los datos y extraerlos
  que vienen en una petición JSON*/

app.set("view engine", "jade");

//Verbos Http => GET /POST /PUT / PATCH / DELETE
//REST

app.get("/",function(req,res){
	console.log(req.session.user_id);
	res.render("index");
});

app.get("/signup",function(req,res){
	User.find(function(err,doc){  /*pasamos una condicion de busqueda https://youtu.be/AbELfRULn1U  min.11*/
		console.log(doc);
		res.render("signup");
	});
});

app.get("/login",function(req,res){
	res.render("login");
});

/*creamos la ruta login.jade*/
/*post porque está definido en el login.jade "form(action="/users",method="POST")"*/
app.post("/users", function(req,res){
	var user = new User({email: req.body.email, 
							password: req.body.password,
							password_confirmation: req.body.password_confirmation,
							username: req.body.username
						});
	//console.log(user.password_confirmation);
	user.save(function(err){
		if(err){
			console.log(String(err));
		}
		res.send("Guardamos tus datos")
	});	
	
});
app.post("/sessions", function(req,res){
	//find => nos  devuelve una coleccion  {}=> query, ""=> campos que queremos que nos devuelva del documento , function => callback
	//findOne => nos devuelve solo un documento
	User.findOne({username: req.body.username,email: req.body.email,password: req.body.password},function(err,user){
		//console.log(user);
		req.session.user_id = user._id;
		res.redirect("/app");
	});
});

app.use("/app",session_middleware);
app.use("/app",router_app);
app.listen(8080);
console.log('conexion puerto 8080');