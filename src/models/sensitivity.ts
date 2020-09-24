import { GasificationPower } from './gasification-power';
import { GenericCombinedHeatPower } from './generic-combined-heat-power';
import { GenericPowerOnly } from './generic-power-only';
import { InputModSensitivity } from './input.model';

function sensitivityCapitalCost(params: InputModSensitivity) {
  const increment1 = (params.base - params.low) / 10;
  const increment2 = (params.high - params.base) / 10;
  params.input.CapitalCost = params.base;
  const baseConstantLAC = GenericPowerOnly(params.input).ConstantLAC
    .ConstantLACofEnergy;
  const constantLAC = [];
  const relativeChange = [];
  let ithConstantLAC = 0;
  let ithRelativeChange = 0;
  for (let i = 0; i < 21; i++) {
    if (i < 11) {
      params.input.CapitalCost = increment1 * i;
    } else {
      params.input.CapitalCost = params.base + increment2 * (i - 10);
    }
    switch (params.model) {
      case 'GPO':
        ithConstantLAC = GenericPowerOnly(params.input).ConstantLAC.ConstantLACofEnergy;
        // console.log(params.input);
        // console.log(ithConstantLAC);
        // console.log('--------------------');
        break;
      case 'CHP':
        ithConstantLAC = GenericCombinedHeatPower(params.input).ConstantLAC
          .ConstantLACofEnergy;
        break;
      case 'GP':
        ithConstantLAC = GasificationPower(params.input).ConstantLAC
          .ConstantLACofEnergy;
        break;
    }
    ithRelativeChange =
      ((ithConstantLAC - baseConstantLAC) / baseConstantLAC) * 100;
    constantLAC.push(ithConstantLAC);
    relativeChange.push(ithRelativeChange);
  }
  return { relativeChange, constantLAC };
}
export { sensitivityCapitalCost };
