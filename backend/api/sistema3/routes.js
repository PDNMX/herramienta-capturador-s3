const router = require("express").Router();
// Controller Imports
const S3_Controller_s3ag = require("./controllers/S3_Controller_s3ag");
const S3_Controller_s3ang = require("./controllers/S3_Controller_s3ang");
//const ProviderController = require("./controllers/ProviderController");
// Middleware Imports
const isAuthenticatedMiddleware = require("./../common/middlewares/IsAuthenticatedMiddleware");

// crear un endpoint de prueba para el sistema 3 s3ag
router.get("/s3ag",
async (req, res) => {
    res.status(200).send("Sistema 3 AG funcionando correctamente. Ahora a probar los endpoints");
    }
);
//rutas ag
router.post("/insert_s3ag", 
            [isAuthenticatedMiddleware.check,],
            S3_Controller_s3ag.create_s3ag);
router.post("/getAll_s3ag",
            [isAuthenticatedMiddleware.check,],
            S3_Controller_s3ag.getAll_s3ag);
router.post("/list_s3ag", 
            [isAuthenticatedMiddleware.check,],
            S3_Controller_s3ag.list_s3ag);
router.put("/update_s3ag",
            [isAuthenticatedMiddleware.check,],
            S3_Controller_s3ag.update_s3ag);
//rutas ang
router.post("/insert_s3ang",
            [isAuthenticatedMiddleware.check,],
            S3_Controller_s3ang.create_S3ang);
            
router.post("/getAll_s3ang",
            [isAuthenticatedMiddleware.check,],
            S3_Controller_s3ang.getAll_S3ang);
router.post("/list_s3ang",
            [isAuthenticatedMiddleware.check,],
            S3_Controller_s3ang.list_S3ang);
router.put("/update_s3ang",
            [isAuthenticatedMiddleware.check,],
            S3_Controller_s3ang.update_S3ang);
            
module.exports = router;