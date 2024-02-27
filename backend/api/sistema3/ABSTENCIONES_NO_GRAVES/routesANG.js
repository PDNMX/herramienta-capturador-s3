const router = require("express").Router();
const controllerANG = require("./controllerANG");
// Middleware Imports
const isAuthenticatedMiddleware = require("./../../common/middlewares/IsAuthenticatedMiddleware");
const SchemaValidationMiddleware = require("../../common/middlewares/SchemaValidationMiddleware");

router.get('/hola', (_, res) => {
    res.status(200).send('Hello from ANOG!, el backend de S3 está funcionando correctamente desde insomnia 123!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
});
router.post('/insert', [isAuthenticatedMiddleware.check], controllerANG.create);
router.post('/getAll', [isAuthenticatedMiddleware.check], controllerANG.getAll);
router.post('/list', [isAuthenticatedMiddleware.check], controllerANG.list);
router.put('/update', [isAuthenticatedMiddleware.check], controllerANG.update);
module.exports = router;