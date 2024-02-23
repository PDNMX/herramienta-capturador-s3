const { User } = require("../models/User");
const moment = require('moment');
const crypto = require("crypto");
const nodemailer = require('nodemailer');
const generator = require('generate-password');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: process.env.HOST_EMAIL,
    port: process.env.PORT_EMAIL,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS_EMAIL
    }
});

// Función para generar la contraseña
function generatepassword() {
    return generator.generate({
        length: 8,
        numbers: true,
        symbols: true,
        lowercase: true,
        uppercase: true,
        strict: true,
        exclude: '_[]<>~´¬@^⌐«»°√α±÷©§'
    });
}

// Función para cifrar la contraseña
const encryptPassword = (password) => {
    const hash = crypto.createHash("sha256");
    hash.update(password);
    return hash.digest("hex");
};


module.exports = {
    createUser: async (req, res) => {
        try {
            const { body } = req;
            const correoExiste = await User.findOne({ correoElectronico: body.correoElectronico });
            const usuarioExiste = await User.findOne({ usuario: body.usuario });

            if (correoExiste || usuarioExiste) {
                return res.status(500).json({ message: 'El correo electrónico y/o nombre de usuario ya existe. Por favor, ingresa otro.', status: 500 });
            }

            // Genera la contraseña
            let pass = generatepassword();

            // Cifra la contraseña
            let passHash = encryptPassword(pass);

            // Crea el nuevo usuario con la contraseña cifrada
            let fechaActual = moment();
            let newBody = { ...body, contrasena: passHash, fechaAlta: fechaActual.format(), vigenciaContrasena: fechaActual.add(3, 'months').format().toString(), estatus: true, rol:"2" };
            const nuevoUsuario = new User(newBody);
            await nuevoUsuario.save();

            // Envía el correo electrónico con la contraseña generada
            let mailOptions = {
                from: process.env.EMAIL,
                to: newBody.correoElectronico,
                subject: 'Bienvenido a la plataforma de administración de usuarios',
                text: `Hola ${newBody.nombre}, tu usuario ha sido creado con éxito. Tu contraseña temporal es: ${pass}. Por favor ingresa a la plataforma y cambia tu contraseña.`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  if (error.code === 'ETIMEDOUT') {
                    console.error('Error de conexión: Tiempo de espera agotado. Reintentando...');
                    // Intenta nuevamente después de un tiempo
                  } else {
                    console.error('Error al enviar el correo electrónico:', error);
                    // Manejo de otros errores
                  }
                } else {
                  console.log('Correo electrónico enviado:', info.response);
                }
              });
              
            return res.status(200).json(newBody);
        } catch (error) {
            console.error('Error al crear usuario:', error);
            return res.status(500).json({ message: 'Error al crear usuario.', error: error.message });
        }
    },

    editUser: async (req, res) => {
        try {
            const { body } = req;

            // Verificar si el usuario que se está intentando actualizar existe en la base de datos
            const usuarioExistente = await User.findById(body._id);
            if (!usuarioExistente) {
                return res.status(404).json({ message: 'El usuario no existe.', status: 404 });
            }

            // Verificar si el correo electrónico o el nombre de usuario ya están asociados a otro usuario diferente
            const correoExiste = await User.findOne({ correoElectronico: body.correoElectronico, _id: { $ne: body._id } });
            const usuarioExiste = await User.findOne({ usuario: body.usuario, _id: { $ne: body._id } });
            if (correoExiste || usuarioExiste) {
                return res.status(500).json({ message: 'El correo electrónico y/o nombre de usuario ya existe. Por favor, ingresa otro.', status: 500 });
            }

            // Actualizar los campos del usuario con los nuevos valores proporcionados en la solicitud
            const fechaActual = moment();
            const updatedUser = await User.findByIdAndUpdate(body._id, { ...body, fechaModificacion: fechaActual.format() }, { new: true });

            // Devolver la información del usuario actualizado como respuesta
            return res.status(200).json(updatedUser);
        } catch (error) {
            console.error('Error al editar usuario:', error);
            return res.status(500).json({ message: 'Error al editar usuario.', error: error.message });
        }
    },
    getUsers: async (req, res) => {
        try {
            // Obtener parámetros de consulta
            const sortObj = req.body.sort || {}; // Puedes considerar usar req.query para los parámetros de consulta
            const page = req.body.page || 1;
            const pageSize = req.body.pageSize || 10;
            const query = req.body.query || {};

            // Verifica que User.paginate esté disponible y funcione correctamente
            const paginationResult = await User.paginate(query, { page: page, limit: pageSize, sort: sortObj, rol: '2' });

            // Construye el objeto de respuesta
            const objpagination = { hasNextPage: paginationResult.hasNextPage, page: paginationResult.page, pageSize: paginationResult.limit, totalRows: paginationResult.totalDocs };
            const objresults = paginationResult.docs;
            const objResponse = { pagination: objpagination, results: objresults };

            // Envía la respuesta
            return res.status(200).json(objResponse);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error en el servidor.' });
        }
    },
    getUsersFull: async (req, res) => {
        try {
            // Obtener parámetros de consulta
            const result = await User.find({ fechaBaja: null, rol: '2' }).then();
            let objResponse = {};
            objResponse['results'] = result;
            res.status(200).json(objResponse);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error en el servidor.' });
        }
    },
    getUsersAll: async (req, res) => {
        try {
            // Obtener parámetros de consulta
            const result = await User.find({ fechaBaja: null }).then();
            let objResponse = {};
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error en el servidor.' });
        }
    },
    getUsersAll: async (req, res) => {
        try {
            const result = await User.find({ rol: '2' });
            let objResponse = {};
            
            try {
              var strippedRows = result.map(row => {
                let label;
                if (row.apellidoDos === undefined) {
                  label = `${row.nombre} ${row.apellidoUno}`;
                } else {
                  label = `${row.nombre} ${row.apellidoUno} ${row.apellidoDos}`;
                }
                let rowExtend = { label: label, value: row._id, ...row.toObject() };
                return rowExtend;
              });
            } catch (e) {
              console.log(e);
              return res.status(500).json({ message: 'Error en el servidor.' });
            }
            
            objResponse['results'] = strippedRows;
            res.status(200).json(objResponse);
          } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error en el servidor.' });
          }  
    },
    validationpassword: async (req, res) => {
        try {
            const { id_usuario } = req.body;

            if (!id_usuario) {
                return res.status(400).json({ message: 'Id Usuario requerido.', Status: 500 });
            }

            const user = await User.findById(id_usuario).exec();

            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado.', Status: 404 });
            }

            if (user.contrasenaNueva === true) {
                return res.status(200).json({ message: 'Necesitas cambiar tu contraseña', Status: 500, contrasenaNueva: true, rol: user.rol, sistemas: user.sistemas, proveedor: user.proveedorDatos, estatus: user.estatus });
            } else {
                return res.status(200).json({ message: 'Tu contraseña está al día.', Status: 200, contrasenaNueva: false, rol: user.rol, sistemas: user.sistemas, proveedor: user.proveedorDatos, estatus: user.estatus });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error en el servidor.', error: error.message });
        }
    },
    resetpassword: async (req, res) => {
        try {
            console.log('hola desde resetpassword');
            const { correo } = req.body;
            console.log(correo);
            if (!correo) {
                return res.status(400).json({ message: 'Correo electrónico requerido.', Status: 500 });
            }


            // Verificar si el usuario está dado de baja
            const usuarioDadoDeBaja = await User.findOne({ correoElectronico: correo, estatus: false });
            if (usuarioDadoDeBaja) {
                return res.status(400).json({ message: 'El usuario está dado de baja en el sistema.', Status: 500 });
            }

            // Verificar si el usuario existe
            const usuario = await User.findOne({ correoElectronico: correo });
            if (!usuario) {
                return res.status(400).json({ message: 'El correo electrónico proporcionado no existe.', Status: 500 });
            }

            // Generar nueva contraseña
            const nuevaContraseña = generator.generate({
                length: 8,
                numbers: true,
                symbols: true,
                lowercase: true,
                uppercase: true,
                strict: true,
                exclude: '_[]<>~´¬@^⌐«»°√α±÷©§'
            });

            // Enviar correo electrónico con la nueva contraseña
            const message = {
                from: process.env.EMAIL,
                to: correo,
                subject: 'Sistema de Captura de Información - PDN',
                html: `<html><p>Buen día, anexamos tu contraseña para acceder al Sistema de Captura de Información:</p><br><p>Contraseña: <code>${nuevaContraseña}</code><br><br></html>`
            };

            transporter.sendMail(message, async (err, info) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Error al enviar la nueva contraseña.', Status: 500 });
                } else {
                    // Actualizar contraseña en la base de datos
                    const contraseñaEncriptada = encryptPassword(nuevaContraseña);
                    const fechaActual = moment();
                    await User.updateOne({ correoElectronico: correo }, { contrasena: contraseñaEncriptada, contrasenaNueva: true, vigenciaContrasena: fechaActual.add(3, 'months').format().toString() });
                    return res.status(200).json({ message: 'Se ha enviado tu nueva contraseña al correo electrónico proporcionado.', Status: 200 });
                }
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error en el servidor.', error: error.message });
        }
    },
    changepassword: async (req, res) => {
        try {
            let contrasena = encryptPassword(req.body.contrasena);
            let passwordConfirmation = encryptPassword(req.body.passwordConfirmation);
            let id = req.body.user;
        
            if (contrasena != passwordConfirmation) {
              res.status(200).json({ message: 'Las contraseñas no coinciden.', Status: 500 });
              return false;
            }
            let fechaActual = moment();
        
            const result = await User.update({ _id: id }, { contrasena: contrasena, contrasenaNueva: false, vigenciaContrasena: fechaActual.add(3, 'months').format().toString() }).then();
            res.status(200).json({ message: '¡Se ha actualizado tu contraseña!.', Status: 200 });
          } catch (e) {
            console.log(e);
          }
    },                                
};
