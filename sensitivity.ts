import { GasificationPower } from './gasification-power';
import { GenericCombinedHeatPower } from './generic-combined-heat-power';
import { GenericPowerOnly } from './generic-power-only';
import { InputModSensitivity } from './input.model';
import { OutputModSensitivity } from './output.model';

export function runSensitivityAnalysis(params: InputModSensitivity) {
  const output: OutputModSensitivity = {
    CapitalCost: {
      constantLAC: [],
      relativeChangeCOE: [],
      relativeChange: [],
    },
    BiomassFuelCost: {
      constantLAC: [],
      relativeChangeCOE: [],
      relativeChange: [],
    },
    DebtRatio: {
      constantLAC: [],
      relativeChangeCOE: [],
      relativeChange: [],
    },
    DebtInterestRate: {
      constantLAC: [],
      relativeChangeCOE: [],
      relativeChange: [],
    },
    CostOfEquity: {
      constantLAC: [],
      relativeChangeCOE: [],
      relativeChange: [],
    },
    NetStationEfficiency: {
      constantLAC: [],
      relativeChangeCOE: [],
      relativeChange: [],
    },
    CapacityFactor: {
      constantLAC: [],
      relativeChangeCOE: [],
      relativeChange: [],
    },
  };
  // Capital Cost
  if (params.model === 'GP') {
    params.input.CapitalCost =
      params.input.CapitalCostElements.GasifierSystemCapitalCost +
      params.input.CapitalCostElements.GasCleaningSystemCapitalCost +
      params.input.CapitalCostElements.PowerGenerationCapitalCost +
      params.input.CapitalCostElements.EmissionControlSystemCapitalCost +
      params.input.CapitalCostElements.HeatRecoverySystemCapitalCost;
  }
  let base = params.input.CapitalCost;
  let increment1 = (base - params.CapitalCost.low) / 10;
  let increment2 = (params.CapitalCost.high - base) / 10;
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
  let ithRelativeChangeCOE = 0;
  let ithRelativeChange = 0;
  for (let i = 0; i < 21; i++) {
    if (i < 11) {
      params.input.CapitalCost = params.CapitalCost.low + increment1 * i;
    } else {
      params.input.CapitalCost = base + increment2 * (i - 10);
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
        // by default, doSensitivityAnalysis = false
        params.input.doSensitivityAnalysis = true;
        ithConstantLAC = GasificationPower(params.input).ConstantLAC
          .ConstantLACofEnergy;
        break;
    }
    ithRelativeChangeCOE =
      ((ithConstantLAC - baseConstantLAC) / baseConstantLAC) * 100;
    output.CapitalCost.constantLAC.push(ithConstantLAC);
    output.CapitalCost.relativeChangeCOE.push(ithRelativeChangeCOE);
    ithRelativeChange = (params.input.CapitalCost - base) / base;
    output.CapitalCost.relativeChange.push(ithRelativeChange * 100);
  }
  params.input.CapitalCost = base;

  // Biomass Fuel Cost
  base = params.input.ExpensesBaseYear.BiomassFuelCost;
  increment1 = (base - params.BiomassFuelCost.low) / 10;
  increment2 = (params.BiomassFuelCost.high - base) / 10;
  for (let i = 0; i < 21; i++) {
    if (i < 11) {
      params.input.ExpensesBaseYear.BiomassFuelCost =
        params.BiomassFuelCost.low + increment1 * i;
    } else {
      params.input.ExpensesBaseYear.BiomassFuelCost =
        base + increment2 * (i - 10);
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
    ithRelativeChangeCOE =
      ((ithConstantLAC - baseConstantLAC) / baseConstantLAC) * 100;
    output.BiomassFuelCost.constantLAC.push(ithConstantLAC);
    output.BiomassFuelCost.relativeChangeCOE.push(ithRelativeChangeCOE);
    ithRelativeChange =
      (params.input.ExpensesBaseYear.BiomassFuelCost - base) / base;
    output.BiomassFuelCost.relativeChange.push(ithRelativeChange * 100);
  }
  params.input.ExpensesBaseYear.BiomassFuelCost = base;

  // Debt Ratio
  base = params.input.Financing.DebtRatio;
  increment1 = (base - params.DebtRatio.low) / 10;
  increment2 = (params.DebtRatio.high - base) / 10;
  for (let i = 0; i < 21; i++) {
    if (i < 11) {
      params.input.Financing.DebtRatio = params.DebtRatio.low + increment1 * i;
    } else {
      params.input.Financing.DebtRatio = base + increment2 * (i - 10);
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
    ithRelativeChangeCOE =
      ((ithConstantLAC - baseConstantLAC) / baseConstantLAC) * 100;
    output.DebtRatio.constantLAC.push(ithConstantLAC);
    output.DebtRatio.relativeChangeCOE.push(ithRelativeChangeCOE);
    ithRelativeChange = (params.input.Financing.DebtRatio - base) / base;
    output.DebtRatio.relativeChange.push(ithRelativeChange * 100);
  }
  params.input.Financing.DebtRatio = base;

  // Debt Interest Ratio
  base = params.input.Financing.InterestRateOnDebt;
  increment1 = (base - params.DebtInterestRate.low) / 10;
  increment2 = (params.DebtInterestRate.high - base) / 10;
  for (let i = 0; i < 21; i++) {
    if (i < 11) {
      params.input.Financing.InterestRateOnDebt =
        params.DebtInterestRate.low + increment1 * i;
    } else {
      params.input.Financing.InterestRateOnDebt = base + increment2 * (i - 10);
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
    ithRelativeChangeCOE =
      ((ithConstantLAC - baseConstantLAC) / baseConstantLAC) * 100;
    output.DebtInterestRate.constantLAC.push(ithConstantLAC);
    output.DebtInterestRate.relativeChangeCOE.push(ithRelativeChangeCOE);
    ithRelativeChange =
      (params.input.Financing.InterestRateOnDebt - base) / base;
    output.DebtInterestRate.relativeChange.push(ithRelativeChange * 100);
  }
  params.input.Financing.InterestRateOnDebt = base;

  // Cost Of Equity
  base = params.input.Financing.CostOfEquity;
  increment1 = (base - params.CostOfEquity.low) / 10;
  increment2 = (params.CostOfEquity.high - base) / 10;
  for (let i = 0; i < 21; i++) {
    if (i < 11) {
      params.input.Financing.CostOfEquity =
        params.CostOfEquity.low + increment1 * i;
    } else {
      params.input.Financing.CostOfEquity = base + increment2 * (i - 10);
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
    ithRelativeChangeCOE =
      ((ithConstantLAC - baseConstantLAC) / baseConstantLAC) * 100;
    output.CostOfEquity.constantLAC.push(ithConstantLAC);
    output.CostOfEquity.relativeChangeCOE.push(ithRelativeChangeCOE);
    ithRelativeChange = (params.input.Financing.CostOfEquity - base) / base;
    output.CostOfEquity.relativeChange.push(ithRelativeChange * 100);
  }
  params.input.Financing.CostOfEquity = base;

  // Net Station Efficiency
  base = params.input.ElectricalFuelBaseYear.NetStationEfficiency;
  increment1 = (base - params.NetStationEfficiency.low) / 10;
  increment2 = (params.NetStationEfficiency.high - base) / 10;
  for (let i = 0; i < 21; i++) {
    if (i < 11) {
      params.input.ElectricalFuelBaseYear.NetStationEfficiency =
        params.NetStationEfficiency.low + increment1 * i;
    } else {
      params.input.ElectricalFuelBaseYear.NetStationEfficiency =
        base + increment2 * (i - 10);
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
    ithRelativeChangeCOE =
      ((ithConstantLAC - baseConstantLAC) / baseConstantLAC) * 100;
    output.NetStationEfficiency.constantLAC.push(ithConstantLAC);
    output.NetStationEfficiency.relativeChangeCOE.push(ithRelativeChangeCOE);
    ithRelativeChange =
      (params.input.ElectricalFuelBaseYear.NetStationEfficiency - base) / base;
    output.NetStationEfficiency.relativeChange.push(ithRelativeChange * 100);
  }
  params.input.ElectricalFuelBaseYear.NetStationEfficiency = base;

  // Capacity Factor
  base = params.input.ElectricalFuelBaseYear.CapacityFactor;
  increment1 = (base - params.CapacityFactor.low) / 10;
  increment2 = (params.CapacityFactor.high - base) / 10;
  for (let i = 0; i < 21; i++) {
    if (i < 11) {
      params.input.ElectricalFuelBaseYear.CapacityFactor =
        params.CapacityFactor.low + increment1 * i;
    } else {
      params.input.ElectricalFuelBaseYear.CapacityFactor =
        base + increment2 * (i - 10);
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
    ithRelativeChangeCOE =
      ((ithConstantLAC - baseConstantLAC) / baseConstantLAC) * 100;
    output.CapacityFactor.constantLAC.push(ithConstantLAC);
    output.CapacityFactor.relativeChangeCOE.push(ithRelativeChangeCOE);
    ithRelativeChange =
      (params.input.ElectricalFuelBaseYear.CapacityFactor - base) / base;
    output.CapacityFactor.relativeChange.push(ithRelativeChange * 100);
  }
  params.input.ElectricalFuelBaseYear.CapacityFactor = base;

  return { output };
}
