/* FALTAS ADMINISTRATIVAS DE SERVIDORES PUBLICOS - GRAVES */
const router = require("express").Router();
const controllerSFG = require("./controllerSFG");

// Middleware Imports
const isAuthenticatedMiddleware = require("../../common/middlewares/IsAuthenticatedMiddleware");
const SchemaValidationMiddleware = require("../../common/middlewares/SchemaValidationMiddleware");

router.get("/hola", (_, res) => {
  res
    .status(200)
    .send(
      "Hello from FG!, el backend de S3 está funcionando correctamente desde insomnia 123!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
    );
});

//rutas FG
router.post("/insert", [isAuthenticatedMiddleware.check], controllerSFG.create);
router.post("/getAll", [isAuthenticatedMiddleware.check], controllerSFG.getAll);
router.post("/list", [isAuthenticatedMiddleware.check], controllerSFG.list);
router.put("/update", [isAuthenticatedMiddleware.check], controllerSFG.update);

module.exports = router;
