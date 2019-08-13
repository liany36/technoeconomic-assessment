import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import express from 'express';
import swaggerUi from 'swagger-ui-express';

import { GasificationPower } from './models/gasification-power';
import { GenericCombinedHeatPower } from './models/generic-combined-heat-power';
import { GenericCombinedHeatPowerInputMod } from './models/generic-combined-heat-power.model';
import { GenericPowerOnly } from './models/generic-power-only';
import { GenericPowerOnlyInputMod } from './models/generic-power-only.model';
import { Hydrogen } from './models/hydrogen';

// tslint:disable-next-line: no-var-requires
const swaggerDocument = require('../swagger.json');

dotenv.config();

const app = express();

app.use(bodyParser.json());

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

// case 'gasification-power':
//   result = await GasificationPower(req.body);
//   break;
// case 'hydrogen':
//   result = await Hydrogen(req.body);

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => console.log(`Listening on port ${port}!`));
