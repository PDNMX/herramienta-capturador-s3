  

  

//// Funcion para cifrar la contraseña  
// Encrypts the password using SHA256 Algorithm, for enhanced security of the password
const encryptPassword = (password) => {
  // We will hash the password using SHA256 Algorithm before storing in the DB
  // Creating SHA-256 hash object
  const hash = crypto.createHash("sha256");
  // Update the hash object with the string to be encrypted
  hash.update(password);
  // Get the encrypted value in hexadecimal format
  return hash.digest("hex");
};

//// funcion para validar los tokens

var validateToken = function (req) {
  var inToken = null;
  var auth = req.headers['authorization'];  
  if (auth && auth.toLowerCase().indexOf('bearer') == 0) {
    inToken = auth.slice('bearer '.length);
  } else if (req.body && req.body.access_token) {
    inToken = req.body.access_token;
  } else if (req.query && req.query.access_token) {
    inToken = req.query.access_token;
  }
  // invalid token - synchronous
  try {
    var decoded = jwt.verify(inToken, process.env.SEED);
    return { code: 200, message: decoded };
  } catch (err) {
    // err
    console.log(err);
    let error = '';
    if (err.message === 'jwt must be provided') {
      error = 'Error el token de autenticación (JWT) es requerido en el header, favor de verificar';
    } else if (err.message === 'invalid signature' || err.message.includes('Unexpected token')) {
      error = 'Error token inválido, el token probablemente ha sido modificado favor de verificar';
    } else if (err.message === 'jwt expired') {
      error = 'Sesión expirada';
    } else {
      error = err.message;
    }
    let obj = { code: 401, message: error };
    return obj;
  }
};


/* 
    Importando funciones de los sistemas
*/
//const funciones = require('./funciones.js');
//const { validateToken } = require('../../funciones.js');

//// Endpoint para revisarla conexion del api del capturador
exports.prueba = async (req, res) => {

  //// Para probar que se llama el endpoint
  /* console.log("prueba desde nuevo server3.js ubicado en el archivo endpoints");
  res.status(200).json({ message: 'Haz llamado el endpoint prueba con exito desde el archivo endpoints.', Status: 200, data: req.body });
 */

  //// Para probar que se llama el endpoint validando el token
  try {
   var code = validateToken(req);
   if (code.code == 401) {
     console.log("prueba fallida desde nuevo server3.js en el archivo endpoints")
     res.status(401).json({ code: '401', message: code.message });
   } else if (code.code == 200) {
     console.log("prueba exitosa desde nuevo server3.js en el archivo endpoints");
     console.log("asdasdasdad"); 
          
     res.status(200).json({ message: 'Haz llamado el endpoint prueba con exito en el archivo endpoints', Status: 200, data: req.body });
     //console.log("prueba ejecutada correctamente desde newserverjs")
   }
 } catch (e) {
   console.log(e);
 }
/* } 
res.status(200).json({ message: 'prueba desde archivo limpio con resultado correcto para el s3 y el s2. Borrar este endpoint', Status: 200 });
*/
};

//------------------------------ Inicio de los endpoints para el api del capturador S2  ------------------------------------------------------
