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
            
/*router.post("/edit_s3ag",[isAuthenticatedMiddleware.check,],S3_Controller_s3ag.edit_s3ag);
router.post("/get_s3ag",[isAuthenticatedMiddleware.check,],S3_Controller_s3ag.get_s3ag);
router.post("/get_all_s3ag",[isAuthenticatedMiddleware.check,],S3_Controller_s3ag.get_all_s3ag);
router.post("/delete_s3ag",[isAuthenticatedMiddleware.check,],S3_Controller_s3ag.delete_s3ag);
router.post("/update_s3ag",[isAuthenticatedMiddleware.check,],S3_Controller_s3ag.update_s3ag); */

module.exports = router;