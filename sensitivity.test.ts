import { runSensitivityAnalysis } from './sensitivity';
import { chpExample, gpExample, gpoExample } from './sensitivity.test.data';

// https://stackoverflow.com/questions/11832914/how-to-round-to-at-most-2-decimal-places-if-necessary?noredirect=1&lq=1
function roundToNdecimal(num: number, n: number) {
  const x = 10 ** n;
  return Math.round((num + Number.EPSILON) * x) / x;
}

test('GPO model gives correct output', () => {
  const results = runSensitivityAnalysis(gpoExample).output;
  expect(roundToNdecimal(results.CapitalCost.relativeChangeCOE[0], 8)).toBe(-42.86060393);
  expect(roundToNdecimal(results.CapitalCost.relativeChangeCOE[5], 8)).toBe(-21.43030196);
  expect(roundToNdecimal(results.CapitalCost.relativeChangeCOE[9], 9)).toBe(-4.286060393);
  expect(roundToNdecimal(results.CapitalCost.relativeChangeCOE[16], 8)).toBe(47.75895866);
  expect(roundToNdecimal(results.CapitalCost.relativeChangeCOE[20], 8)).toBe(79.59826443);
  expect(roundToNdecimal(results.CapitalCost.relativeChangeCOE[20], 8)).toBe(79.59826443);
  expect(roundToNdecimal(results.BiomassFuelCost.relativeChangeCOE[5], 8)).toBe(-23.91023498);
  expect(roundToNdecimal(results.BiomassFuelCost.relativeChangeCOE[15], 8)).toBe(84.52620483);
  expect(roundToNdecimal(results.DebtRatio.relativeChangeCOE[5], 8)).toBe(20.64921218);
  expect(roundToNdecimal(results.DebtRatio.relativeChangeCOE[15], 9)).toBe(-6.883070727);
  expect(roundToNdecimal(results.DebtInterestRate.relativeChangeCOE[5], 9)).toBe(-3.590990139);
  expect(roundToNdecimal(results.DebtInterestRate.relativeChangeCOE[15], 8)).toBe(10.76263118);
  expect(roundToNdecimal(results.CostOfEquity.relativeChangeCOE[5], 9)).toBe(-8.733849486);
  expect(roundToNdecimal(results.CostOfEquity.relativeChangeCOE[15], 8)).toBe(29.20674716);
  expect(roundToNdecimal(results.NetStationEfficiency.relativeChangeCOE[5], 8)).toBe(28.69228197);
  expect(roundToNdecimal(results.NetStationEfficiency.relativeChangeCOE[15], 8)).toBe(-20.49448712);
  expect(roundToNdecimal(results.CapacityFactor.relativeChangeCOE[5], 8)).toBe(19.99793747);
  expect(roundToNdecimal(results.CapacityFactor.relativeChangeCOE[15], 8)).toBe(-4.50403997);
});

test('CHP model gives correct output', () => {
  const results = runSensitivityAnalysis(chpExample).output;
  expect(roundToNdecimal(results.CapitalCost.relativeChangeCOE[0], 8)).toBe(-58.40801285);
  expect(roundToNdecimal(results.CapitalCost.relativeChangeCOE[5], 8)).toBe(-29.20400642);
  expect(roundToNdecimal(results.CapitalCost.relativeChangeCOE[9], 9)).toBe(-5.840801285);
  expect(roundToNdecimal(results.CapitalCost.relativeChangeCOE[16], 8)).toBe(65.08321432);
  expect(roundToNdecimal(results.CapitalCost.relativeChangeCOE[20], 7)).toBe(108.4720239);
  expect(roundToNdecimal(results.BiomassFuelCost.relativeChangeCOE[5], 8)).toBe(-32.58351922);
  expect(roundToNdecimal(results.BiomassFuelCost.relativeChangeCOE[15], 6)).toBe(115.187543);
  expect(roundToNdecimal(results.DebtRatio.relativeChangeCOE[5], 8)).toBe(28.13958134);
  expect(roundToNdecimal(results.DebtRatio.relativeChangeCOE[15], 9)).toBe(-9.379860445);
  expect(roundToNdecimal(results.DebtInterestRate.relativeChangeCOE[5], 9)).toBe(-4.893598758);
  expect(roundToNdecimal(results.DebtInterestRate.relativeChangeCOE[15], 8)).toBe(14.66670655);
  expect(roundToNdecimal(results.CostOfEquity.relativeChangeCOE[5], 8)).toBe(-11.90199732);
  expect(roundToNdecimal(results.CostOfEquity.relativeChangeCOE[15], 7)).toBe(39.8013072);
  expect(roundToNdecimal(results.NetStationEfficiency.relativeChangeCOE[5], 8)).toBe(11.05303902);
  expect(roundToNdecimal(results.NetStationEfficiency.relativeChangeCOE[15], 9)).toBe(-7.895027872);
  expect(roundToNdecimal(results.CapacityFactor.relativeChangeCOE[5], 7)).toBe(27.2520609);
  expect(roundToNdecimal(results.CapacityFactor.relativeChangeCOE[15], 9)).toBe(-6.137851555);
});

test('GP model gives correct output', () => {
  const results = runSensitivityAnalysis(gpExample).output;
  expect(roundToNdecimal(results.CapitalCost.relativeChangeCOE[0], 8)).toBe(-24.83757791);
  expect(roundToNdecimal(results.CapitalCost.relativeChangeCOE[5], 8)).toBe(-12.41878896);
  expect(roundToNdecimal(results.CapitalCost.relativeChangeCOE[9], 9)).toBe(-2.483757791);
  expect(roundToNdecimal(results.CapitalCost.relativeChangeCOE[16], 8)).toBe(19.16041725);
  expect(roundToNdecimal(results.CapitalCost.relativeChangeCOE[20], 8)).toBe(31.93402874);
  expect(roundToNdecimal(results.BiomassFuelCost.relativeChangeCOE[5], 8)).toBe(-28.71585769);
  expect(roundToNdecimal(results.BiomassFuelCost.relativeChangeCOE[15], 7)).toBe(101.5147894);
  expect(roundToNdecimal(results.DebtRatio.relativeChangeCOE[5], 8)).toBe(17.09397554);
  expect(roundToNdecimal(results.DebtRatio.relativeChangeCOE[15], 9)).toBe(-1.899330615);
  expect(roundToNdecimal(results.DebtInterestRate.relativeChangeCOE[5], 9)).toBe(-3.114812054);
  expect(roundToNdecimal(results.DebtInterestRate.relativeChangeCOE[15], 9)).toBe(9.322496841);
  expect(roundToNdecimal(results.CostOfEquity.relativeChangeCOE[5], 9)).toBe(-2.615650806);
  expect(roundToNdecimal(results.CostOfEquity.relativeChangeCOE[15], 8)).toBe(9.26876899);
  expect(roundToNdecimal(results.NetStationEfficiency.relativeChangeCOE[5], 8)).toBe(38.97725685);
  expect(roundToNdecimal(results.NetStationEfficiency.relativeChangeCOE[15], 8)).toBe(-22.42527106);
  expect(roundToNdecimal(results.CapacityFactor.relativeChangeCOE[5], 8)).toBe(12.59068313);
  expect(roundToNdecimal(results.CapacityFactor.relativeChangeCOE[15], 9)).toBe(-2.835739443);
});
