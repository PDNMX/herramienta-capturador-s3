const Express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const app = Express();
const cors = require("cors");
const morgan = require("morgan");

const { port } = require("./config");

const PORT = process.env.PORT || 30040;
const USERMONGO = process.env.USERMONGO || "usuario-capturador";
const PASSWORDMONGO = process.env.PASSWORDMONGO || "password-capturador";
const HOSTMONGO = process.env.HOSTMONGO || "localhost";
const DATABASE = process.env.DATABASE || "admin";

console.log("PORT: ", PORT);
console.log("USERMONGO: ", USERMONGO);
console.log("PASSWORDMONGO: ", PASSWORDMONGO);
console.log("HOSTMONGO: ", HOSTMONGO);
console.log("DATABASE: ", DATABASE);  


// Express Routes Import
/* const AuthorizationRoutes = require("./authorization/routes");
const UserRoutes = require("./users/routes");
const ProductRoutes = require("./products/routes"); */
const S2Routes = require("./sistema2/routes");
const providerRoutes = require("./proveedor/providerRoutes");
const userRoutes = require("./usuario/userRoutes");

app.use(morgan("tiny"));
app.use(cors());

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
        DATABASE,
      { useNewUrlParser: true, useUnifiedTopology: true },
    );

    // Attaching the Authentication and User Routes to the app.
    //app.use("/", AuthorizationRoutes);
    app.use("/s2", S2Routes);
    app.use("/", providerRoutes);
    app.use("/", userRoutes);

    app.listen(PORT, () => console.log("Server Listening on PORT:", PORT));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
