const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

// Define el esquema del usuario
const userSchema = new mongoose.Schema({
    nombre: String,
    apellidoUno: String,
    apellidoDos: String,
    cargo: String,
    correoElectronico: { type: String, unique: true },
    telefono: String,
    extension: String,
    usuario: { type: String, unique: true },
    contrasena: String, // Cambié "contrasena" a "contrasena" para corregir un error de escritura
    sistemas: { type: [], default: void 0 },
    fechaAlta: String,
    fechaBaja: String,
    estatus: Boolean,
    vigenciaContrasena: String,
    proveedorDatos: String,
    contrasenaNueva: Boolean,
    rol: String
});

// Aplica el plugin mongoosePaginate al esquema del usuario
userSchema.plugin(mongoosePaginate);

// Conexión a la base de datos administracionUsuarios y definición del modelo User
const userConnection = mongoose.connection.useDb("administracionUsuarios");
const User = userConnection.model("usuarios", userSchema, "usuarios");

// Exporta tanto la conexión a la base de datos como el modelo User
module.exports = {
    userConnection,
    User
};

    //const S2 = mongoose.connection.useDb("S2").model("spic", S2Schema, "spic");
    // Exportar las funciones del modelo de producto
    /*     module.exports = {
        User,
        createUser: (data) => {
            const user = new User(data);
            return user.save();
        },
        findUser:(correo) => {
            console.log("Hola desde metodo finduser del modelo")
            const correoElectronico = correo;
            const boleano = user.find({ correoElectronico: { $regex: new RegExp('^' + correoElectronico, 'i') } }, { fechaBaja: { $eq: null } }).countDocuments();
            return boleano;  
        },
        findOne:(correo, usuario) =>{
            console.log("desde findone");

        }
    }; */
