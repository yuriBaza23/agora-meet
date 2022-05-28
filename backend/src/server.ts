import 'reflect-metadata';
import cors from 'cors';
import express from 'express';
import 'express-async-errors';

import {router} from './routes';

const app = express();

app.use(express.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header("Access-Control-Allow-Headers", "x-access-token, Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(router);

app.listen(3333, () => console.log("It's alive!!"));
