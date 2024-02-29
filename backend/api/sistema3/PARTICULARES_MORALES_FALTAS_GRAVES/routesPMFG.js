/* ACTOS DE PARTICULARES VINCULADOS CON FALTAS GRAVES - PERSONAS MORALES */
const router = require("express").Router();
const controllerPMFG = require("./controllerPMFG");
// Middleware Imports
const isAuthenticatedMiddleware = require("./../../common/middlewares/IsAuthenticatedMiddleware");
const SchemaValidationMiddleware = require("../../common/middlewares/SchemaValidationMiddleware");

router.get('/hola', (_, res) => {
    res.status(200).send('Hello from particulares morales faltas graves!, el backend de S3 está funcionando correctamente desde insomnia 123!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
});

router.post('/insert', [isAuthenticatedMiddleware.check], controllerPMFG.create);
router.post('/getAll', [isAuthenticatedMiddleware.check], controllerPMFG.getAll);
router.post('/list', [isAuthenticatedMiddleware.check], controllerPMFG.list);
router.put('/update', [isAuthenticatedMiddleware.check], controllerPMFG.update);  

module.exports = router;