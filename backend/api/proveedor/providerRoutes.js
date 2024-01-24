const router = require("express").Router();

// Controller Imports
const ProviderController = require("./controllers/ProviderController");
// Middleware Imports
const isAuthenticatedMiddleware = require("../common/middlewares/IsAuthenticatedMiddleware");
const SchemaValidationMiddleware = require("../common/middlewares/SchemaValidationMiddleware");

//********************************************************** crear proveedoor */*********************************************************/

router.post(
    "/proveedor123",

    (_,res) => {
      console.log("hola desde el router de probar123");
      res.send(' funcionando correctamente desde proveedor!')
    }
);

router.post(
    "/create/provider",
    [
      isAuthenticatedMiddleware.check,
      /* CheckPermissionMiddleware.has(roles.ADMIN), */
      //SchemaValidationMiddleware.verify(createS2Payload),
    ],
    ProviderController.createProvider
  /*   (_,res) => {
      res.send(' funcionando correctamente!')
    } */
  );
  
  router.post(
    "/edit/provider",
    [
      isAuthenticatedMiddleware.check,
      /* CheckPermissionMiddleware.has(roles.ADMIN), */
      //SchemaValidationMiddleware.verify(createS2Payload),
    ],
    ProviderController.editProvider
    /* (_,res) => {
      res.send(' funcionando correctamente desde el edit provider router!')
    }  */
  );
  
    module.exports = router;

  /********************************************************* Final crear proveedoor **********************************************************/
  