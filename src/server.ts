import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import express from 'express';
import swaggerUi from 'swagger-ui-express';

import { GasificationPower } from './models/gasification-power';
import { GenericCombinedHeatPower } from './models/generic-combined-heat-power';
import { GenericPowerOnly } from './models/generic-power-only';
import { Hydrogen } from './models/hydrogen';
import {
  InputModCHP,
  InputModGP,
  InputModGPO,
  InputModHydrogen,
  InputModTransimission,
} from './models/input.model';
import { TransmissionCost } from './models/transmission';

// tslint:disable-next-line: no-var-requires
const swaggerDocument = require('../swagger.json');

dotenv.config();

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

const port = process.env.PORT || 3000;

app.post('/genericPowerOnly', async (req: any, res: any) => {
  const params: InputModGPO = req.body;
  try {
    const result = await GenericPowerOnly(params);
    res.status(200).json(result);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

app.post('/genericCombinedHeatPower', async (req: any, res: any) => {
  const params: InputModCHP = req.body;
  try {
    const result = await GenericCombinedHeatPower(params);
    res.status(200).json(result);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

app.post('/gasificationPower', async (req: any, res: any) => {
  const params: InputModGP = req.body;
  try {
    const result = await GasificationPower(params);
    res.status(200).json(result);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

app.post('/hydrogen', async (req: any, res: any) => {
  const params: InputModHydrogen = req.body;
  try {
    const result = await Hydrogen(params);
    res.status(200).json(result);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

app.post('/transmission', async (req: any, res: any) => {
  const params: InputModTransimission = req.body;
  try {
    const result = await TransmissionCost(params);
    res.status(200).json(result);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => console.log(`Listening on port ${port}!`));
