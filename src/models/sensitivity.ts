import { GasificationPower } from './gasification-power';
import { GenericCombinedHeatPower } from './generic-combined-heat-power';
import { GenericPowerOnly } from './generic-power-only';
import { InputModSensitivity } from './input.model';
import { OutputModSensitivity } from './output.model';

function sensitivity(params: InputModSensitivity) {
  const output: OutputModSensitivity = {
    CapitalCost: {
      constantLAC: [],
      relativeChange: [],
    },
    BiomassFuelCost: {
      constantLAC: [],
      relativeChange: [],
    },
    DebtRatio: {
      constantLAC: [],
      relativeChange: [],
    },
    DebtInterestRate: {
      constantLAC: [],
      relativeChange: [],
    },
    CostOfEquity: {
      constantLAC: [],
      relativeChange: [],
    },
    NetStationEfficiency: {
      constantLAC: [],
      relativeChange: [],
    },
    CapacityFactor: {
      constantLAC: [],
      relativeChange: [],
    },
  };
  // Capital Cost
  let increment1 = (params.CapitalCost.base - params.CapitalCost.low) / 10;
  let increment2 = (params.CapitalCost.high - params.CapitalCost.base) / 10;
  params.input.CapitalCost = params.CapitalCost.base;
  let baseConstantLAC = 0;
  switch (params.model) {
      case 'GPO':
        baseConstantLAC = GenericPowerOnly(params.input).ConstantLAC.ConstantLACofEnergy;
        break;
      case 'CHP':
        baseConstantLAC = GenericCombinedHeatPower(params.input).ConstantLAC.ConstantLACofEnergy;
        break;
    case 'GP':
        baseConstantLAC = GasificationPower(params.input).ConstantLAC.ConstantLACofEnergy;
        break;
  }
  let ithConstantLAC = 0;
  let ithRelativeChange = 0;
  for (let i = 0; i < 21; i++) {
    if (i < 11) {
      params.input.CapitalCost = increment1 * i;
    } else {
      params.input.CapitalCost =
        params.CapitalCost.base + increment2 * (i - 10);
    }
    switch (params.model) {
      case 'GPO':
        ithConstantLAC = GenericPowerOnly(params.input).ConstantLAC
          .ConstantLACofEnergy;
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
    output.CapitalCost.constantLAC.push(ithConstantLAC);
    output.CapitalCost.relativeChange.push(ithRelativeChange);
  }
  params.input.CapitalCost = params.CapitalCost.base;

  // Biomass Fuel Cost
  increment1 = (params.BiomassFuelCost.base - params.BiomassFuelCost.low) / 10;
  increment2 = (params.BiomassFuelCost.high - params.BiomassFuelCost.base) / 10;
  for (let i = 0; i < 21; i++) {
    if (i < 11) {
      params.input.ExpensesBaseYear.BiomassFuelCost = increment1 * i;
    } else {
      params.input.ExpensesBaseYear.BiomassFuelCost =
        params.BiomassFuelCost.base + increment2 * (i - 10);
    }
    switch (params.model) {
      case 'GPO':
        ithConstantLAC = GenericPowerOnly(params.input).ConstantLAC
          .ConstantLACofEnergy;
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
    output.BiomassFuelCost.constantLAC.push(ithConstantLAC);
    output.BiomassFuelCost.relativeChange.push(ithRelativeChange);
  }
  params.input.ExpensesBaseYear.BiomassFuelCost = params.BiomassFuelCost.base;

  return { output };
}
export { sensitivity };
