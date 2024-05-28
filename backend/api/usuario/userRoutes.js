const router = require("express").Router();

// Controller Imports
const User = require("../usuario/controllers/UserController");
// Middleware Imports
const isAuthenticatedMiddleware = require("../common/middlewares/IsAuthenticatedMiddleware");
const SchemaValidationMiddleware = require("../common/middlewares/SchemaValidationMiddleware");
const UserController = require("../usuario/controllers/UserController");
const { Router } = require("express");

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
    UserController.createUser
  /*   (_,res) => {
      res.send(' funcionando correctamente!')
    } */

);

router.put(
    "/edit/user", 
    [
      isAuthenticatedMiddleware.check,
      /* CheckPermissionMiddleware.has(roles.ADMIN), */
      //SchemaValidationMiddleware.verify(createS2Payload),
    ],
    UserController.editUser
  /*   (_,res) => {
      res.send(' funcionando correctamente!')
    } */

);

router.post('/getUsers', [
  isAuthenticatedMiddleware.check,
  /* CheckPermissionMiddleware.has(roles.ADMIN), */
  //SchemaValidationMiddleware.verify(createS2Payload),
], UserController.getUsers);

router.post('/getUsersFull', [
  isAuthenticatedMiddleware.check,
  /* CheckPermissionMiddleware.has(roles.ADMIN), */
  //SchemaValidationMiddleware.verify(createS2Payload),
], UserController.getUsersFull);

router.post('/getUsersAll', [
  isAuthenticatedMiddleware.check
], 
UserController.getUsersAll);

router.post('/validationpassword', [isAuthenticatedMiddleware.check,],  UserController.validationpassword);

router.post('/resetpassword', UserController.resetpassword);

router.post('/changepassword', UserController.changepassword);
router.post('/changePasswordAdmin', [isAuthenticatedMiddleware.check,], UserController.changepasswordAdmin);
//router.post('/addAdmin', [isAuthenticatedMiddleware.check,], UserController.addAdmin); 
module.exports = router;

//********************************************************** termian crear usuario ****************************************************/

