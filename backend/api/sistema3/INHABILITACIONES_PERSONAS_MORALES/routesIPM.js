/* SANCIONES (INHABILITACIONES) POR NORMAS DIVERSAS A LA LGRA - PERSONAS MORALES*/
const router = require("express").Router();
const controllerIPM = require("./controllerIPM");
// Middleware Imports
const isAuthenticatedMiddleware = require("./../../common/middlewares/IsAuthenticatedMiddleware");
const SchemaValidationMiddleware = require("../../common/middlewares/SchemaValidationMiddleware");

router.get('/hola', (_, res) => {
    res.status(200).send('Hello from IPM!, el backend de S3 está funcionando correctamente desde insomnia 123!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
});

router.post('/insert', [isAuthenticatedMiddleware.check], controllerIPM.create);
router.post('/getAll', [isAuthenticatedMiddleware.check], controllerIPM.getAll);
router.post('/list', [isAuthenticatedMiddleware.check], controllerIPM.list);
router.put('/update', [isAuthenticatedMiddleware.check], controllerIPM.update);

module.exports = router;