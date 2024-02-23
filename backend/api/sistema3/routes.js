const router = require("express").Router();
// Controller Imports
const S3_Controller_s3ag = require("./controllers/S3_Controller_s3ag");
//const ProviderController = require("./controllers/ProviderController");
// Middleware Imports
const isAuthenticatedMiddleware = require("./../common/middlewares/IsAuthenticatedMiddleware");

// crear un endpoint de prueba para el sistema 3 s3ag
router.get("/s3ag",
async (req, res) => {
    res.status(200).send("Sistema 3 AG funcionando correctamente. Ahora a probar los endpoints");
    }
);

router.post("/create_s3ag", 
            [isAuthenticatedMiddleware.check,],
            S3_Controller_s3ag.create_s3ag);

module.exports = router;