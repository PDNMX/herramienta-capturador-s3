/* HECHOS DE CORRUPCION - PERSONAS MORALES */
const router = require("express").Router();
const controllerHCPM = require("./controllerHCPM");
// Middleware Imports
const isAuthenticatedMiddleware = require("./../../common/middlewares/IsAuthenticatedMiddleware");
const SchemaValidationMiddleware = require("../../common/middlewares/SchemaValidationMiddleware");
/* const { route } = require("../routes"); */

router.get('/hola', (_, res) => {
    res.status(200).send('Hello from HCPM!, el backend de S3 está funcionando correctamente desde insomnia 123!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
});


router.post('/insert', [isAuthenticatedMiddleware.check], controllerHCPM.create);
router.post('/getAll', [isAuthenticatedMiddleware.check], controllerHCPM.getAll);
router.post('/list', [isAuthenticatedMiddleware.check], controllerHCPM.list);
router.put('/update', [isAuthenticatedMiddleware.check], controllerHCPM.update); 

module.exports = router;