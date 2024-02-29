/* ACTOS DE PARTICULARES VINCULADOS CON FALTAS GRAVES - PERSONAS FISICAS */
const router = require("express").Router();
const controllerPFG = require("./controllerPFG");
// Middleware Imports
const isAuthenticatedMiddleware = require("./../../common/middlewares/IsAuthenticatedMiddleware");
const SchemaValidationMiddleware = require("../../common/middlewares/SchemaValidationMiddleware");

router.get('/hola', (_, res) => {
    res.status(200).send('Hello from PFG!, el backend de S3 está funcionando correctamente desde insomnia 123!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
});

router.post('/insert', [isAuthenticatedMiddleware.check], controllerPFG.create);
router.post('/getAll', [isAuthenticatedMiddleware.check], controllerPFG.getAll);
router.post('/list', [isAuthenticatedMiddleware.check], controllerPFG.list);
router.put('/update', [isAuthenticatedMiddleware.check], controllerPFG.update); 

module.exports = router;