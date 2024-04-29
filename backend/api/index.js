const Express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const bodyParser = require('body-parser');
const app = Express();
const cors = require("cors");
const morgan = require("morgan");

const { port } = require("./config");

const PORT = process.env.PORT;
const USERMONGO = process.env.USERMONGO;
const PASSWORDMONGO = process.env.PASSWORDMONGO;
const HOSTMONGO = process.env.HOSTMONGO;
const DATABASE = process.env.DATABASE;

console.log("PORT: ", PORT);
console.log("USERMONGO: ", USERMONGO);
console.log("PASSWORDMONGO: ", PASSWORDMONGO);
console.log("HOSTMONGO: ", HOSTMONGO);
console.log("DATABASE: ", DATABASE);

// Express Routes Import
/* const AuthorizationRoutes = require("./authorization/routes");
const UserRoutes = require("./users/routes");
const ProductRoutes = require("./products/routes"); */
const providerRoutes = require("./proveedor/providerRoutes");
const userRoutes = require("./usuario/userRoutes");
const AGRoutes = require("./sistema3/ABSTENCIONES_GRAVES/routesAG");
const ANGRoutes = require("./sistema3/ABSTENCIONES_NO_GRAVES/routesANG");
const IPFRoutes = require("./sistema3/INHABILITACIONES_PERSONAS_FISICAS/routesIPF");
const IPMRoutes = require("./sistema3/INHABILITACIONES_PERSONAS_MORALES/routesIPM");
const SFGRoutes = require("./sistema3/SERVIDORES_FALTAS_GRAVES/routesSFG");
const SFNGRoutes = require("./sistema3/SERVIDORES_NO_GRAVES/routesSFNG");
const PFGRoutes = require("./sistema3/PARTICULARES_FALTAS_GRAVES/routesPFG");
const PMFGRoutes = require("./sistema3/PARTICULARES_MORALES_FALTAS_GRAVES/routesPMFG");
const HCPFRoutes = require("./sistema3/HECHOS_CORRUPCION_PERSONAS_FISICAS/routesHCPF");
const HCPMRoutes = require("./sistema3/HECHOS_CORRUPCION_PERSONAS MORALES/routesHCPM");
const HCSPRoutes = require("./sistema3/HECHOS_CORRUPCION_SERVIDORES_PUBLICOS/routesHCSP");

app.use(morgan("tiny"));
//app.use(cors());
app.use(cors(), bodyParser.urlencoded({ extended: true }), bodyParser.json());

// Middleware that parses the body payloads as JSON to be consumed next set
// of middlewares and controllers.
app.use(Express.json());
0app.use(Express.urlencoded({ extended: true }));

const start = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(
      "mongodb://" +
        USERMONGO +
        ":" +
        PASSWORDMONGO +
        "@" +
        HOSTMONGO +
        "/" +
        DATABASE +
        "?authSource=admin",
      { useNewUrlParser: true, useUnifiedTopology: true }
    );

    // Attaching the Authentication and User Routes to the app.
    //app.use("/", AuthorizationRoutes);
    app.use("/", providerRoutes);
    app.use("/", userRoutes);
    app.use("/S3/ABSTENCIONES-GRAVES/", AGRoutes);
    app.use("/S3/ABSTENCIONES-NO-GRAVES/", ANGRoutes);
    app.use("/S3/INHABILITACIONES-PERSONAS-FISICAS/", IPFRoutes);
    app.use("/S3/INHABILITACIONES-PERSONAS-MORALES/", IPMRoutes);
    app.use("/S3/SERVIDORES-FALTAS-GRAVES/", SFGRoutes);
    app.use("/S3/SERVIDORES-NO-GRAVES/", SFNGRoutes);
    app.use("/S3/PARTICULARES-PERSONAS-FISICAS-FALTAS-GRAVES/", PFGRoutes);
    app.use("/S3/PARTICULARES-PERSONAS-MORALES-FALTAS-GRAVES/", PMFGRoutes);
    app.use("/S3/HECHOS-CORRUPCION-PERSONAS-FISICAS/", HCPFRoutes);
    app.use("/S3/HECHOS-CORRUPCION-PERSONAS-MORALES/", HCPMRoutes);
    app.use("/S3/HECHOS-CORRUPCION-SERVIDORES-PUBLICOS/", HCSPRoutes);

    app.listen(PORT, () => console.log("Server Listening on PORT:", PORT));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
