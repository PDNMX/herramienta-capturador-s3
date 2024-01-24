const router = require("express").Router();

// Controller Imports
const S2Controller = require("./controllers/S2Controller");
//const ProviderController = require("./controllers/ProviderController");
// Middleware Imports
const isAuthenticatedMiddleware = require("./../common/middlewares/IsAuthenticatedMiddleware");
const SchemaValidationMiddleware = require("../common/middlewares/SchemaValidationMiddleware");
/* const CheckPermissionMiddleware = require("../common/middlewares/CheckPermissionMiddleware");
// JSON Schema Imports for payload verification */
/* const createS2Payload = require("./schemas/createS2Payload") */;

/* const updateProductPayload = require("./schemas/updateProductPayload");
const { roles } = require("../config"); */

router.get('/hola', [isAuthenticatedMiddleware.check], (_, res) => {
  res.send('Hello from A!, el backend de S2 está funcionando correctamente desde insomnia 123!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
})


router.post(
  "/create",
  [
    isAuthenticatedMiddleware.check,
    /* CheckPermissionMiddleware.has(roles.ADMIN), */
    //SchemaValidationMiddleware.verify(createS2Payload),
  ],
  S2Controller.createS2
);

router.post(
  "/insert",
  [
    isAuthenticatedMiddleware.check,
  ],
  //S2Controller.insertS2
   (_, res) => {
    res.send(' Otro endpoint está para insertar está funcionando correctamente!')
  }
 
  );


/* router.get(
  "/",
  [isAuthenticatedMiddleware.check],
  ProductController.getAllProducts
);

router.get(
  "/:productId",
  [isAuthenticatedMiddleware.check],
  ProductController.getProductById
);

router.post(
  "/",
  [
    isAuthenticatedMiddleware.check,
    CheckPermissionMiddleware.has(roles.ADMIN),
    SchemaValidationMiddleware.verify(createProductPayload),
  ],
  ProductController.createProduct
);

router.patch(
  "/:productId",
  [
    isAuthenticatedMiddleware.check,
    CheckPermissionMiddleware.has(roles.ADMIN),
    SchemaValidationMiddleware.verify(updateProductPayload),
  ],
  ProductController.updateProduct
);

router.delete(
  "/:productId",
  [isAuthenticatedMiddleware.check, CheckPermissionMiddleware.has(roles.ADMIN)],
  ProductController.deleteProduct
); */

module.exports = router;
