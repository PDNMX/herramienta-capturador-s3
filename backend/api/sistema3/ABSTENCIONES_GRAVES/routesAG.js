/* ABSTENCIONES - GRAVES */
const router = require("express").Router();
const controllerAG = require("./controllerAG");
// Middleware Imports
const isAuthenticatedMiddleware = require("./../../common/middlewares/IsAuthenticatedMiddleware");
const SchemaValidationMiddleware = require("../../common/middlewares/SchemaValidationMiddleware");

router.get('/hola', (_, res) => {
    res.status(200).send('Hello from AG!, el backend de S3 está funcionando correctamente desde insomnia 123!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
});

//rutas ag
 router.post("/insert", 
            [isAuthenticatedMiddleware.check,],
            controllerAG.create); 
 router.post("/getAll",
            [isAuthenticatedMiddleware.check,],
            controllerAG.getAll);
router.post("/list", 
            [isAuthenticatedMiddleware.check,],
            controllerAG.list);
router.put("/update",
            [isAuthenticatedMiddleware.check,],
            controllerAG.update); 

module.exports = router;