const router = require("express").Router();

// Controller Imports
const User = require("../usuario/controllers/UserController");
// Middleware Imports
const isAuthenticatedMiddleware = require("../common/middlewares/IsAuthenticatedMiddleware");
const SchemaValidationMiddleware = require("../common/middlewares/SchemaValidationMiddleware");

//********************************************************** crear usuario */*********************************************************/

router.post(
    "/probarUsuario",
    (_,res) => {
      console.log("hola desde el router de probar123");
      res.send(' funcionando correctamente desde rutas genericas!')
    }
);

router.post(
    "/create/user", 
    [
      isAuthenticatedMiddleware.check,
      /* CheckPermissionMiddleware.has(roles.ADMIN), */
      //SchemaValidationMiddleware.verify(createS2Payload),
    ],
    User.createUser
  /*   (_,res) => {
      res.send(' funcionando correctamente!')
    } */

);



module.exports = router;

//********************************************************** termian crear usuario ****************************************************/

