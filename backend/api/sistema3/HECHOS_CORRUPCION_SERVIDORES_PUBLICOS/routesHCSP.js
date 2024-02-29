/* HECHOS DE CORRUPCION - SERVIDORES PUBLICOS */
const router = require("express").Router();
const controllerHCSP = require("./controllerHCSP");
// Middleware Imports
const isAuthenticatedMiddleware = require("./../../common/middlewares/IsAuthenticatedMiddleware");
const SchemaValidationMiddleware = require("../../common/middlewares/SchemaValidationMiddleware");
/* const { route } = require("../routes"); */

router.get('/hola', (_, res) => {
    res.status(200).send('Hello from HCSP!, el backend de S3 está funcionando correctamente desde insomnia 123!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
});

router.post('/insert', [isAuthenticatedMiddleware.check], controllerHCSP.create);
router.post('/getAll', [isAuthenticatedMiddleware.check], controllerHCSP.getAll);
router.post('/list', [isAuthenticatedMiddleware.check], controllerHCSP.list);
router.put('/update', [isAuthenticatedMiddleware.check], controllerHCSP.update);

module.exports = router;