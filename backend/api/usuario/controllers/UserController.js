const { User } = require("../models/User");
const moment = require('moment');
const crypto = require("crypto");
const nodemailer = require('nodemailer');
const generator = require('generate-password');
require('dotenv').config();
//valiudaciones
const { userSchemaJSON } = require("../models/ajvUserSchema"); // Asegúrate de importar el esquema correcto
const Ajv = require("ajv");
const ajv = new Ajv();
const validate = ajv.compile(userSchemaJSON);

const emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,})$/;

function validateEmail(email) {
  return emailRegex.test(email);
}
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
        
            // Valida los datos del cuerpo de la solicitud con el esquema AJV
            const isValid = validate(body);
            if (!isValid) {
              const errors = validate.errors.map(error => ({
                field: error.dataPath,
                message: error.message,
              }));
              //console.log("Hola desde el controlador con datos invalidos");
              return res.status(400).json({ errors });
            }
                // Validacion si existe el correo que se intenta registrar 
                const correoExiste = await User.findOne({ correoElectronico: body.correoElectronico });
                const usuarioExiste = await User.findOne({ usuario: body.usuario });

                if (correoExiste || usuarioExiste) {
                    return res.status(500).json({ message: 'El correo electrónico y/o nombre de usuario ya existe. Por favor, ingresa otro.', status: 500 });
                }

                //creacion del registro que se insertara en usuario
                
                // Genera la contraseña
                let pass = generatepassword();
                // Cifra la contraseña
                let passHash = encryptPassword(pass);
                let fecha = moment().tz("America/Mexico_City").format('YYYY-MM-DD'); 
                let fechaActual = moment();
                let newBody = { ...body, contrasena: passHash, fechaAlta: fecha, vigenciaContrasena: fechaActual.add(3, 'months').format().toString(), estatus: true, rol:"2", contrasenaNueva:true };
                newBody["fechaActualizacion"] = fecha;
                // se inserta el usuario en la base de datos
                const nuevoUsuario = new User(newBody);
                await nuevoUsuario.save();

                // Envía el correo electrónico con la contraseña generada
            let mailOptions = {
                from: process.env.EMAIL,
                to: newBody.correoElectronico,
                subject: 'Acceso a la Herramienta de Captura de Información del Sistema Nacional de Servidores Públicos y Particulares Sancionados',
                html: `<!DOCTYPE html>
                <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1">
                  <style>
                    html { font-size: 16px; /* Establece el tamaño de fuente base en 16px (1rem) */ } body { font-family: Roboto, Helvetica, Arial, sans-serif; color: #666666; background-color: #f7fafc; text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 100vh; } .card { max-width: 37.5rem; /* 600px / 16px = 37.5rem */ margin: 0 auto; background-color: #fff; border: 0.0625rem solid #e2e8f0; /* 1px / 16px = 0.0625rem */ border-radius: 0.375rem; /* 6px / 16px = 0.375rem */ padding: 1.25rem; /* 20px / 16px = 1.25rem */ border-bottom: 0.25rem solid #9085DA; /* 4px / 16px = 0.25rem */ } h1 { font-size: 1.5rem; /* 24px / 16px = 1.5rem */ font-weight: 700; } h3 { font-size: 1.25rem; /* 20px / 16px = 1.25rem */ font-weight: 500; } p { font-size: 1rem; /* 16px / 16px = 1rem */ } .w-24 { width: 6rem; /* 96px / 16px = 6rem */} .w-40 { width: 10rem; /* 160px / 16px = 10rem */ padding: 1.25rem;} .text-muted { color: #718096; } @media screen and (max-width: 37.5rem) { /* 600px / 16px = 37.5rem */ .card { padding: 0.625rem; /* 10px / 16px = 0.625rem */ } }
                  </style>
                </head>
                <body>
                <table class="card" role="presentation">        
                  <tr>
                    <td>
                      <h2>!Hola, ${newBody.nombre}!</h2> 
                      <h2>Se ha creado su usuario en la Herramienta de Captura de Información del Sistema Nacional de Servidores Públicos y Particulares Sancionados.</h2>
                
                      <p>Contraseña temporal (un solo uso): </p>
                      <h3><code>${pass}</code></h3>
                      <p>Ingrese y cámbiela de inmediato en la sección correspondiente.<br>Si requiere asistencia, contáctese con el área de soporte técnico.</p>
                    </td>
                  </tr>
                </table>
                <br>
                <div class="text-muted text-center">
                  <a href="https://plataformadigitalnacional.org/">Plataforma Digital Nacional</a>
                </div>
                
                </body>
                </html>
                `
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
                //console.log("Hola desde el controlador con datos validos");
                //return res.status(200).json({message:"todo ok"});
          } catch (error) {
            console.error("Error al crear usuario:", error);
            return res.status(500).json({ message: "Error al crear usuario.", error: error.message });
          }
    },
    editUser: async (req, res) => {
        try {
          const { body } = req;
      
          // Valida los datos del cuerpo de la solicitud con el esquema AJV
          const isValid = validate(body);
          if (!isValid) {
            const errors = validate.errors.map(error => ({
              field: error.dataPath,
              message: error.message,
            }));
            return res.status(400).json({ errors });
          }
      
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
            //console.log('hola desde resetpassword');
            const { correo } = req.body;
            console.log(correo);

            // **Validar correo electrónico antes de continuar**
            if (!validateEmail(correo)) {
                return res.status(400).json({ message: 'Correo electrónico inválido.', Status: 500 });
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
                subject: 'Restablecimiento de contraseña',
                html: `<!DOCTYPE html>
                <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1">
                  <style>
                    html { font-size: 16px; /* Establece el tamaño de fuente base en 16px (1rem) */ } body { font-family: Roboto, Helvetica, Arial, sans-serif; color: #666666; background-color: #f7fafc; text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 100vh; } .card { max-width: 37.5rem; /* 600px / 16px = 37.5rem */ margin: 0 auto; background-color: #fff; border: 0.0625rem solid #e2e8f0; /* 1px / 16px = 0.0625rem */ border-radius: 0.375rem; /* 6px / 16px = 0.375rem */ padding: 1.25rem; /* 20px / 16px = 1.25rem */ border-bottom: 0.25rem solid #9085DA; /* 4px / 16px = 0.25rem */ } h1 { font-size: 1.5rem; /* 24px / 16px = 1.5rem */ font-weight: 700; } h3 { font-size: 1.25rem; /* 20px / 16px = 1.25rem */ font-weight: 500; } p { font-size: 1rem; /* 16px / 16px = 1rem */ } .w-24 { width: 6rem; /* 96px / 16px = 6rem */} .w-40 { width: 10rem; /* 160px / 16px = 10rem */ padding: 1.25rem;} .text-muted { color: #718096; } @media screen and (max-width: 37.5rem) { /* 600px / 16px = 37.5rem */ .card { padding: 0.625rem; /* 10px / 16px = 0.625rem */ } }
                  </style>
                </head>
                <body>
                
                <table class="card" role="presentation">
                  <tr>
                    <td>
                      <h1>Restablecimiento de contraseña</h1>
                      <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en la Herramienta de Captura de Información del Sistema Nacional de Servidores Públicos y Particulares Sancionados.</p>
                
                      <p>Tu nueva contraseña temporal (de un solo uso) es:</p>
                      <h3><code>${nuevaContraseña}</code></h3>
                
                      <p>Por favor, ingresa a tu cuenta y cambia esta contraseña inmediatamente.</p>
                    </td>
                  </tr>
                </table>
                <br>
                <div class="text-muted text-center">
                  <a href="https://plataformadigitalnacional.org/">Plataforma Digital Nacional</a>
                </div>
                
                </body>
                </html>
                `
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
    changepasswordAdmin: async (req, res) => {
      console.log('hola desde changepasswordAdmin');
      
      let usuario = req.body.usuario;
      const usuarioExiste = await User.findOne({ usuario: usuario });

      if (usuarioExiste) {
        const cambioPass = await User.findOneAndUpdate({ usuario: usuario }, { contrasena: encryptPassword(req.body.contrasena), contrasenaNueva: false });
        return res.status(200).json({ message: '¡Se ha actualizado tu contraseña!.', Status: 200 });
        }
      else{
      return res.status(500).json({ message: 'El nombre de administrador no existe. Por favor, ingresa otro.', status: 500 });
      }
    }, 
    /* addAdmin: async (req, res) => {
      console.log('hola desde addAdmin');
      const usuario = req.body.usuario;
      const usuarioExiste = await User.findOne({ usuario: usuario });
    
      if (usuarioExiste) {
        return res.status(500).json({ message: 'El nombre de administrador ya existe. Por favor, ingresa otro.', status: 500 });
      } else {
        const fecha = moment().tz("America/Mexico_City").format('YYYY-MM-DD');
        let dataUser = req.body;
        dataUser.fechaAlta = fecha;
        dataUser.fechaActualizacion = fecha;
        console.log(dataUser);
        const nuevoUsuario = new User(dataUser);
        await nuevoUsuario.save();
        return res.status(200).json({ message: '¡Se ha agregado un administrador!', Status: 200 });
      }
    }, */
};
