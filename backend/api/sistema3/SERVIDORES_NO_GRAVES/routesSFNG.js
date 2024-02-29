/* FALTAS ADMINISTRATIVAS DE SERVIDORES PUBLICOS - NO GRAVES  */
const router = require("express").Router();
const controllerSFNG = require("./controllerSFNG");

// Middleware Imports
const isAuthenticatedMiddleware = require("../../common/middlewares/IsAuthenticatedMiddleware");
const SchemaValidationMiddleware = require("../../common/middlewares/SchemaValidationMiddleware");

router.get("/hola", (_, res) => {
  res
    .status(200)
    .send(
      "Hello from /S3/SERVIDORES-NO-GRAVES/!, el backend de S3 está funcionando correctamente desde insomnia 123!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
    );
});

//rutas SFNG
router.post("/insert", [isAuthenticatedMiddleware.check], controllerSFNG.create);
router.post("/getAll", [isAuthenticatedMiddleware.check], controllerSFNG.getAll);
router.post("/list", [isAuthenticatedMiddleware.check], controllerSFNG.list);
router.put("/update", [isAuthenticatedMiddleware.check], controllerSFNG.update);
 
module.exports = router;
