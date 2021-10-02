import { runSensitivityAnalysis } from './sensitivity';
import { chpExample, gpExample, gpoExample } from './sensitivity.test.data';

test('GPO model gives correct output', () => {
  const results = runSensitivityAnalysis(gpoExample);

  // GPO results look good.  Here is an example of full testing of one of the output dimensions
  expect(results.output.CapitalCost.relativeChangeCOE).toStrictEqual([
    -44.84741838128577,
    -40.362676543157164,
    -35.87793470502859,
    -31.393192866900034,
    -26.90845102877147,
    -22.423709190642896,
    -17.938967352514293,
    -13.454225514385735,
    -8.969483676257147,
    -4.484741838128588,
    0,
    8.328806270810167,
    16.6576125416204,
    24.986418812430593,
    33.315225083240826,
    41.64403135405105,
    49.97283762486131,
    58.30164389567142,
    66.63045016648165,
    74.95925643729194,
    83.28806270810215
  ]);
});

test('CHP model gives correct output', () => {
  const results = runSensitivityAnalysis(chpExample);

  // FIX: the outputs are huge and shouldn't be -- the cart relative change COE axis is between [-100,250]
  // values in this array are in the trillions
  expect(Math.max(...results.output.BiomassFuelCost.relativeChangeCOE)).toBeLessThan(250);
});

test('GP model gives correct output', () => {
  const results = runSensitivityAnalysis(gpExample);

  // FIX: the outputs returned are not numbers in most cases
  expect(results.output.BiomassFuelCost.relativeChangeCOE[0]).not.toBeNaN();
});
