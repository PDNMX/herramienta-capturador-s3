const mongoose = require('mongoose')

    const userSchema = new mongoose.Schema({
        nombre: String,
        apellidoUno: String,
        apellidoDos: String,
        cargo: String,
        correoElectronico: { type: String, unique: true },
        telefono: String,
        extension: String,
        usuario: { type: String, unique: true },
        constrasena: String,
        sistemas: { type: [], default: void 0 },
        fechaAlta: String,
        fechaBaja: String,
        estatus: Boolean,
        vigenciaContrasena: String,
        proveedorDatos: String,
        contrasenaNueva: Boolean,
        rol: String
    });
    
    const User = mongoose.connection.useDb("administracionUsuarios").model("usuarios", userSchema, "usuarios");

    //const S2 = mongoose.connection.useDb("S2").model("spic", S2Schema, "spic");
    // Exportar las funciones del modelo de producto
    module.exports = {
        createUser: (data) => {
            
            const user = new User(data);
            return user.save();
        },
        updateUser: (id, data) => {
            console.log("hola desde la edicion del provider");
        }
    };
