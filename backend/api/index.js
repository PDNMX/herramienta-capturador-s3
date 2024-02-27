const Express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const bodyParser = require("body-parser");
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
const S3Routes = require("./sistema3/routes");
const providerRoutes = require("./proveedor/providerRoutes");
const userRoutes = require("./usuario/userRoutes");
const AGRoutes = require("./sistema3/ABSTENCIONES_GRAVES/routesAG");
const ANGRoutes = require("./sistema3/ABSTENCIONES_NO_GRAVES/routesANG");
const IPFRoutes = require("./sistema3/INHABILITACIONES_PERSONAS_FISICAS/routesIPF");
app.use(morgan("tiny"));
//app.use(cors());
app.use(cors(), bodyParser.urlencoded({ extended: true }), bodyParser.json());

// Middleware that parses the body payloads as JSON to be consumed next set
// of middlewares and controllers.
app.use(Express.json());

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
    app.use("/", S3Routes);
    app.use("/", providerRoutes);
    app.use("/", userRoutes);
    app.use("/S3/ABSTENCIONES-GRAVES/", AGRoutes);
    app.use("/S3/ABSTENCIONES-NO-GRAVES/", ANGRoutes);
    app.use("/S3/INHABILITACIONES-PERSONAS-FISICAS/", IPFRoutes);
    
    app.listen(PORT, () => console.log("Server Listening on PORT:", PORT));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
