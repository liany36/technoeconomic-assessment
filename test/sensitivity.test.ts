import { calculateSensitivity } from '../src';
import { gpoExample } from './data/sensitivity';

test("GPO model gives correct output", () => {
  const results = calculateSensitivity(gpoExample);

  // TODO: more full testing here
  expect(results.output.CapitalCost.relativeChangeCOE).toStrictEqual([
    -44.84741838128575,
    -40.36267654315716,
    -35.87793470502858,
    -31.393192866900023,
    -26.90845102877144,
    -22.423709190642853,
    -17.93896735251428,
    -13.45422551438572,
    -8.969483676257163,
    -4.484741838128574,
    0,
    8.328806270810215,
    16.657612541620416,
    24.986418812430582,
    33.31522508324085,
    41.644031354051045,
    49.972837624861214,
    58.30164389567144,
    66.63045016648161,
    74.95925643729187,
    83.28806270810205,
  ]);
});
