import "colors";
import "@babel/polyfill";
import cors from "cors";
import dotenv from "dotenv";
import logger from "morgan";
import express from "express";
import mongoose from "mongoose";
import expressIP from "express-ip";
import bodyParser from "body-parser";
import routes from "./routes";
import config from "./config";

dotenv.config();

const app = express();

// make bluebird default Promise
Promise = require("bluebird");

// plugin bluebird promise in mongoose
mongoose.Promise = Promise;

app.use(cors());
app.use(logger("development")); // log requests to the console
// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressIP().getIpInfoMiddleware);

// connect to mongo db
const mongoUri = config.mongo.host;
mongoose.connect(mongoUri, {
  dbName: config.db,
  promiseLibrary: global.Promise,
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// listen to mongo db connection
mongoose.connection.on("error", (error) => {
  throw new Error(`unable to connect to database: ${mongoUri}`);
});

// print mongoose logs in dev env
if (config.mongooseDebug) {
  mongoose.set("debug", true, function (coll, method, query, doc) {
    log.debug("query executed:", coll, method, query, doc);
  });
}

app.use(routes);

app.get("*", (req, res) =>
  res.status(200).send({
    message: "Welcome to the Hahiye API ----88888---",
  })
);

const port = config.port || 4000;

app.listen(port, () => {
  console.log(`Server running at ${port}`);
});
export default app;
