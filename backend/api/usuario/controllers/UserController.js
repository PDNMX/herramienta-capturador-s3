const UserModel = require("../models/User");

module.exports = {
    createUser: (req, res) => {
        
            console.log("hola desde crear usuario");
        },
}

/* 
app.post('/create/user', async (req, res) => {
    try {
      var code = validateToken(req);
      if (code.code == 401) {
        res.status(401).json({ code: '401', message: code.message });
      } else if (code.code == 200) {
        try {
          var correoexiste = await User.find({ correoElectronico: { $regex: new RegExp('^' + req.body.correoElectronico, 'i') } }, { fechaBaja: { $eq: null } }).countDocuments();
          if (correoexiste === undefined) {
            correoexiste = 0;
          }
  
          var usuarioexiste = await User.find({ usuario: { $regex: new RegExp('^' + req.body.usuario, 'i') } }, { fechaBaja: { $eq: null } }).countDocuments();
          if (usuarioexiste === undefined) {
            usuarioexiste = 0;
          }
  
          if (correoexiste > 0 || usuarioexiste > 0) {
            res.status(500).json({ message: 'El correo electrónico y/o nombre de usuario ya existe.Debes ingresar otro.', Status: 500 });
          } else {
            var generator = require('generate-password');
            var pass = '';
            function generatepassword() {
              pass = generator.generate({
                length: 8,
                numbers: true,
                symbols: true,
                lowercase: true,
                uppercase: true,
                strict: true,
                exclude: '_[]<>~´¬@^⌐«»°√α±÷©§'
              });
            }
  
            generatepassword();
            
            //// Aqui se crea el objeto json que se va a insertar en la base de datos
            let fechaActual = moment();
            let passHash = encryptPassword(pass);
            //console.log(passHash);
            let newBody = { ...req.body, contrasena: passHash, fechaAlta: fechaActual.format(), vigenciaContrasena: fechaActual.add(3, 'months').format().toString(), estatus: true };
  
            await schemaUserCreate.concat(schemaUser).validate({
              nombre: newBody.nombre,
              apellidoUno: newBody.apellidoUno,
              apellidoDos: newBody.apellidoDos,
              cargo: newBody.cargo,
              correoElectronico: newBody.correoElectronico,
              telefono: newBody.telefono,
              extension: newBody.extension,
              usuario: newBody.usuario,
              constrasena: newBody.contrasena,
              sistemas: newBody.sistemas,
              proveedorDatos: newBody.proveedorDatos,
              estatus: true,
              fechaAlta: newBody.fechaAlta,
              vigenciaContrasena: newBody.vigenciaContrasena,
              rol: '2'
            });
            if (newBody.passwordConfirmation) {
              delete newBody.passwordConfirmation;
            }
  
            delete newBody.constrasena;
            newBody['constrasena'] = passHash;
            newBody['contrasenaNueva'] = true;
            newBody['rol'] = 2;
            if (req.body.apellidoDos == '' || req.body.apellidoDos === undefined) {
              newBody['apellidoDos'] = '';
            }
  
            const client = new SMTPClient({
              user: process.env.EMAIL,
              password: process.env.PASS_EMAIL,
              host: process.env.HOST_EMAIL,
              ssl: true
            });
  
            const message = {
              text: 'Bienvenido al Sistema de Captura de Información - PDN',
              from: process.env.EMAIL,
              to: newBody.correoElectronico,
              subject: 'Bienvenido al Sistema de Captura de Información - PDN',
              attachment: [{ data: '<html><p>Buen día, anexamos tu credenciales para acceder al Sistema de Captura de Información:</p><br><p>Usuario: <code>' + newBody.usuario + '</code></p><br><p>Contraseña: <code>' + pass + '</code></p><br><br><p>Al iniciar sesión por primera vez deberás establecer una nueva contraseña</p></html>', alternative: true }]
            };
  
            ///// Enviar correo indicando que se registró correctamente el usuario
            client.send(message, function (err, message) {
              if (err != null) {
                res.status(400).json({ message: 'Hay errores al enviar tu nueva contraseña. Ponte en contacto con el administrador.', Status: 500 });
              }
            }); 
  
            const nuevoUsuario = new User(newBody);
            let response;
            response = await nuevoUsuario.save();
            res.status(200).json(response);
          }
        } catch (e) {
          let errorMessage = {};
          errorMessage['errores'] = e.errors;
          errorMessage['campo'] = e.path;
          errorMessage['tipoError'] = e.type;
          errorMessage['mensaje'] = e.message;
          res.status(400).json(errorMessage);
        }
      }
    } catch (e) {
      console.log(e);
    }
  });
   */