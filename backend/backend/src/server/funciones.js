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
let validateToken = function (req) {
    let inToken = null;
    let auth = req.headers['authorization'];
  
    if (auth && auth.toLowerCase().indexOf('bearer') == 0) {
      inToken = auth.slice('bearer '.length);
    } else if (req.body && req.body.access_token) {
      inToken = req.body.access_token;
    } else if (req.query && req.query.access_token) {
      inToken = req.query.access_token;
    }
    // invalid token - synchronous
    try {
      let decoded = jwt.verify(inToken, process.env.SEED);
      return { code: 200, message: decoded };
    } catch (err) {
      // err
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
      return obj;2
    }
  };
