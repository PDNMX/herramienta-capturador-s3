/* HECHOS DE CORRUPCION - PERSONAS FISICAS */
const router = require("express").Router();
const controllerHCPF = require("./controllerHCPF");
// Middleware Imports
const isAuthenticatedMiddleware = require("./../../common/middlewares/IsAuthenticatedMiddleware");
const SchemaValidationMiddleware = require("../../common/middlewares/SchemaValidationMiddleware");
/* const { route } = require("../routes"); */

router.get('/hola', (_, res) => {
    res.status(200).send('Hello from HCPF!, el backend de S3 está funcionando correctamente desde insomnia 123!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
});

router.post('/insert', [isAuthenticatedMiddleware.check], controllerHCPF.create);
router.post('/getAll', [isAuthenticatedMiddleware.check], controllerHCPF.getAll);
router.post('/list', [isAuthenticatedMiddleware.check], controllerHCPF.list);
router.put('/update', [isAuthenticatedMiddleware.check], controllerHCPF.update);

module.exports = router;