var mongoose = require("mongoose");
var Schema = mongoose.Schema; //esquema => 'Schema'
/*Schema es el atributo que retorna un objeto. 
Es un constructor que sirve para poder generar nuestros esquemas*/

//Conexion MongoDB
mongoose.connect("mongodb://localhost/usuarios");


var posibles_valores = ["M","F"];

var email_match=[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,"Coloca un email valido"];

var password_validation = {
	validator: function(p){
		return this.password_confirmation == p;
	} ,
	message: "Las contraseñas no son iguales"

	}	


var user_schema = new Schema({
	name: String,
	username: {type: String, required: true,maxlenght:[50,"Username es muy grande"]},
	password: {type:String,required: true,minlength:[8,"El password es muy corto"], validate: password_validation},
	age: {type: Number,min:[18,"La edad no puede ser menor que 18 años"],max:[100,"La edad no puede ser mayor de 100 años"]},
	email: {type: String, required: "El correo es obligatorio",match:email_match},
	date_of_birth: Date,
	sex:{type: String, enum:{values: posibles_valores, message:"Opción no válida"}}
});
/*
Tipos de datos que podemos definir para un documentos
=>String
=>Number
=>Date
=>Buffer
=>Boolean
=>Mixed
=>Objectid
=>Array
*/

user_schema.virtual("password_confirmation").get(function(){
	return this.p_c;
	}).set(function(password){
		this.p_c = password;
	});

var User = mongoose.model("User",user_schema);/*model es el constructor que genera los modelos 
												y User es el nombre del modelo*/

module.exports.User = User;