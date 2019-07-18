import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import express from 'express';
// import swaggerUi from 'swagger-ui-express';

import { InputVarMod } from './models/tea.model';
import { calculate } from './models/tearun';

// tslint:disable-next-line: no-var-requires
// const swaggerDocument = require('../swagger.json');

dotenv.config();

const app = express();

app.use(bodyParser.json());

const port = 3000;

app.post('/tearun', async (req: any, res: any) => {
  const inputParams: InputVarMod = req.body;
  console.log('req object = ');
  console.log(inputParams);
  const result = await calculate(inputParams);
  console.log('result = ');
  console.log(result);
  res.status(200).json(result);
});

// app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => console.log(`Listening on port ${port}!`));
