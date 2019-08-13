import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import express from 'express';
import swaggerUi from 'swagger-ui-express';

import { GasificationPower } from './models/gasification-power';
import { GenericCombinedHeatPower } from './models/generic-combined-heat-power';
import { GenericPowerOnly } from './models/generic-power-only';
import { Hydrogen } from './models/hydrogen';

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

app.post('/tearun', async (req: any, res: any) => {
  // const inputParams: GenericPowerOnlyInputMod = req.body;
  console.log('\nrequest object = ');
  console.log(req.body);
  let result = {};
  switch (req.body.model) {
    case 'generic-power-only':
      result = await GenericPowerOnly(req.body);
      break;
    case 'generic-combined-heat-power':
      result = await GenericCombinedHeatPower(req.body);
      break;
    case 'gasification-power':
      result = await GasificationPower(req.body);
      break;
    case 'hydrogen':
      result = await Hydrogen(req.body);
  }
  // const result = await calculate(res.body);
  console.log('result object = ');
  console.log(result);
  res.status(200).json(result);
});

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => console.log(`Listening on port ${port}!`));
