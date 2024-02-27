const router = require("express").Router();
const controllerIPF = require("./controllerIPF");
// Middleware Imports
const isAuthenticatedMiddleware = require("./../../common/middlewares/IsAuthenticatedMiddleware");
const SchemaValidationMiddleware = require("../../common/middlewares/SchemaValidationMiddleware");

router.get('/hola', (_, res) => {
    res.status(200).send('Hello from IPF!, el backend de S3 está funcionando correctamente desde insomnia 123!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
});

router.post('/insert', [isAuthenticatedMiddleware.check], controllerIPF.create);
router.post('/getAll', [isAuthenticatedMiddleware.check], controllerIPF.getAll);
router.post('/list', [isAuthenticatedMiddleware.check], controllerIPF.list);
router.put('/update', [isAuthenticatedMiddleware.check], controllerIPF.update);

module.exports = router;