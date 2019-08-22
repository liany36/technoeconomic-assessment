import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import express from 'express';
import swaggerUi from 'swagger-ui-express';

import { GasificationPower } from './models/gasification-power';
import { GenericCombinedHeatPower } from './models/generic-combined-heat-power';
import { GenericPowerOnly } from './models/generic-power-only';
import { Hydrogen } from './models/hydrogen';
import { GasificationPowerInputMod, GenericCombinedHeatPowerInputMod,
  GenericPowerOnlyInputMod, HydrogenInputMod } from './models/input.model';

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
  const params: GenericPowerOnlyInputMod = req.body;
  const result = await GenericPowerOnly(params);
  res.status(200).json(result);
});

app.post('/genericCombinedHeatPower', async (req: any, res: any) => {
  const params: GenericCombinedHeatPowerInputMod = req.body;
  const result = await GenericCombinedHeatPower(params);
  res.status(200).json(result);
});

app.post('/gasificationPower', async (req: any, res: any) => {
  const params: GasificationPowerInputMod = req.body;
  const result = await GasificationPower(params);
  res.status(200).json(result);
});

app.post('/hydrogen', async (req: any, res: any) => {
  const params: HydrogenInputMod = req.body;
  const result = await Hydrogen(params);
  res.status(200).json(result);
});

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => console.log(`Listening on port ${port}!`));
