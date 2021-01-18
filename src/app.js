import "babel-polyfill";
import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import routes  from './routes';
import dotenv from 'dotenv';
import cors from 'cors';
import config from "./config";
import mongoose from "mongoose";


dotenv.config();


const app = express();


// make bluebird default Promise
Promise = require("bluebird");

// plugin bluebird promise in mongoose
mongoose.Promise = Promise;



app.use(cors());

app.use(logger('development')); // log requests to the console
// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// connect to mongo db
const mongoUri = config.mongo.host;
mongoose.connect(mongoUri, {
  dbName: config.db,
  promiseLibrary: global.Promise,
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

// listen to mongo db connection
mongoose.connection.on("error", error => {
  throw new Error(`unable to connect to database: ${mongoUri}`);
});

// print mongoose logs in dev env
if (config.mongooseDebug) {
  mongoose.set("debug", (collectionName, method, query, doc) => {
    debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
  });
}


app.use(routes);

app.get('*', (req, res) => res.status(200).send({
  message: 'Welcome to the Hahiye API route',
}));

const port = config.port || 4000;

app.listen(port, () => {
  console.log(`Server running at ${port}`);
});