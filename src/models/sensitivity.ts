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
  let baseConstantLAC = 0;
  switch (params.model) {
    case 'GPO':
      baseConstantLAC = GenericPowerOnly(params.input).ConstantLAC
        .ConstantLACofEnergy;
      break;
    case 'CHP':
      baseConstantLAC = GenericCombinedHeatPower(params.input).ConstantLAC
        .ConstantLACofEnergy;
      break;
    case 'GP':
      baseConstantLAC = GasificationPower(params.input).ConstantLAC
        .ConstantLACofEnergy;
      break;
  }
  let ithConstantLAC = 0;
  let ithRelativeChange = 0;
  for (let i = 0; i < 21; i++) {
    if (i < 11) {
      params.input.CapitalCost = params.CapitalCost.low + increment1 * i;
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
      params.input.ExpensesBaseYear.BiomassFuelCost =
        params.BiomassFuelCost.low + increment1 * i;
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

  // Debt Ratio
  increment1 = (params.DebtRatio.base - params.DebtRatio.low) / 10;
  increment2 = (params.DebtRatio.high - params.DebtRatio.base) / 10;
  for (let i = 0; i < 21; i++) {
    if (i < 11) {
      params.input.Financing.DebtRatio = params.DebtRatio.low + increment1 * i;
    } else {
      params.input.Financing.DebtRatio =
        params.DebtRatio.base + increment2 * (i - 10);
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
    output.DebtRatio.constantLAC.push(ithConstantLAC);
    output.DebtRatio.relativeChange.push(ithRelativeChange);
  }
  params.input.Financing.DebtRatio = params.DebtRatio.base;

  // Debt Interest Ratio
  increment1 =
    (params.DebtInterestRate.base - params.DebtInterestRate.low) / 10;
  increment2 =
    (params.DebtInterestRate.high - params.DebtInterestRate.base) / 10;
  for (let i = 0; i < 21; i++) {
    if (i < 11) {
      params.input.Financing.InterestRateOnDebt =
        params.DebtInterestRate.low + increment1 * i;
    } else {
      params.input.Financing.InterestRateOnDebt =
        params.DebtInterestRate.base + increment2 * (i - 10);
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
    output.DebtInterestRate.constantLAC.push(ithConstantLAC);
    output.DebtInterestRate.relativeChange.push(ithRelativeChange);
  }
  params.input.Financing.InterestRateOnDebt = params.DebtInterestRate.base;

  // Cost Of Equity
  increment1 = (params.CostOfEquity.base - params.CostOfEquity.low) / 10;
  increment2 = (params.CostOfEquity.high - params.CostOfEquity.base) / 10;
  for (let i = 0; i < 21; i++) {
    if (i < 11) {
      params.input.Financing.CostOfEquity =
        params.CostOfEquity.low + increment1 * i;
    } else {
      params.input.Financing.CostOfEquity =
        params.CostOfEquity.base + increment2 * (i - 10);
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
    output.CostOfEquity.constantLAC.push(ithConstantLAC);
    output.CostOfEquity.relativeChange.push(ithRelativeChange);
  }
  params.input.Financing.CostOfEquity = params.CostOfEquity.base;

  // Net Station Efficiency
  increment1 =
    (params.NetStationEfficiency.base - params.NetStationEfficiency.low) / 10;
  increment2 =
    (params.NetStationEfficiency.high - params.NetStationEfficiency.base) / 10;
  for (let i = 0; i < 21; i++) {
    if (i < 11) {
      params.input.ElectricalFuelBaseYear.NetStationEfficiency =
        params.NetStationEfficiency.low + increment1 * i;
    } else {
      params.input.ElectricalFuelBaseYear.NetStationEfficiency =
        params.NetStationEfficiency.base + increment2 * (i - 10);
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
    output.NetStationEfficiency.constantLAC.push(ithConstantLAC);
    output.NetStationEfficiency.relativeChange.push(ithRelativeChange);
  }
  params.input.ElectricalFuelBaseYear.NetStationEfficiency =
    params.NetStationEfficiency.base;

  // Capacity Factor
  increment1 = (params.CapacityFactor.base - params.CapacityFactor.low) / 10;
  increment2 = (params.CapacityFactor.high - params.CapacityFactor.base) / 10;
  for (let i = 0; i < 21; i++) {
    if (i < 11) {
      params.input.ElectricalFuelBaseYear.CapacityFactor =
        params.CapacityFactor.low + increment1 * i;
    } else {
      params.input.ElectricalFuelBaseYear.CapacityFactor =
        params.CapacityFactor.base + increment2 * (i - 10);
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
    output.CapacityFactor.constantLAC.push(ithConstantLAC);
    output.CapacityFactor.relativeChange.push(ithRelativeChange);
  }
  params.input.ElectricalFuelBaseYear.CapacityFactor =
    params.CapacityFactor.base;

  return { output };
}
export { sensitivity };
