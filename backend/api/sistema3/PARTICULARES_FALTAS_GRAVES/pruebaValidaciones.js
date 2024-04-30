/* SANCIONES (INHABILITACIONES) POR NORMAS DIVERSAS A LA LGRA - PERSONAS FISICAS  */
const {S3pfg} = require("./modelPFG");
const _ = require("lodash");
const moment = require("moment-timezone");
const { User } = require("../../usuario/models/User");
const {
  proveedorRegistros,
} = require("../../proveedor/models/proveedorRegistros");
//swagger
const Ajv = require('ajv');
const SwaggerParser = require('swagger-parser');

// Cargar y combinar la especificación

module.exports = {
    validar: async (req, res) => {
        try {
            let newdocument = req.body;
            let fecha = moment().tz("America/Mexico_City").format();
            /*  Swagger pruebas */
            let api = "";
           yaml_file = '/home/phoenix/Sesna/desarrollo/nodejs/herrramienta-capturador-s3/backend/api/sistema3/S3V2.yaml'; 
            // Cargar y combinar la especificaciónconst SwaggerParser = require('swagger-parser');

            SwaggerParser.bundle(yaml_file, async (err, api) => {
                if (err) {
                    console.error('Error al cargar la especificación:', err);
                } else {
                    // Obtener la definición de la ruta /v2/ssancionados
                    const definition = api.paths['/v2/ssancionados'].post.requestBody.content['application/json'].schema;
            
                    // Convertir la definición a JSON Schema
                    const jsonSchema = SwaggerParser.convert(definition);
            
                    // Crear una instancia de AJV y compilar el esquema
                    const ajv = new Ajv();
                    const validate = ajv.compile(jsonSchema);
            
                    // Objeto req.body que se va a validar
                    const data = req.body;
            
                    // Validar req.body contra el esquema
                    const valid = validate(data);
                    if (!valid) {
                        console.log('req.body no cumple con la especificación:', validate.errors);
                    } else {
                        console.log('req.body válido según la especificación.');
                    }
                }
            });
            res.status(200).json({
                message: "Se realizarón las validaciones correctamente en s3pfg"
                
            });
        } catch (error) {
            return res.status(500).json({ message: "Error: ", error: error.message });
        }
    },
};

