import { GasificationPower } from './models/gasification-power';
import { GenericCombinedHeatPower } from './models/generic-combined-heat-power';
import { GenericPowerOnly } from './models/generic-power-only';
import { Hydrogen } from './models/hydrogen';
import {
  InputModCHP,
  InputModGP,
  InputModGPO,
  InputModHydrogen,
  InputModSubstation,
  InputModTransimission,
} from './models/input.model';
import { SubstationCost } from './models/substation';
import { TransmissionCost } from './models/transmission';

export const genericPowerOnly = (params: InputModGPO) => {
  return GenericPowerOnly(params);
};

export const genericCombinedHeatPower = (params: InputModCHP) => {
  return GenericCombinedHeatPower(params);
};

export const gasificationPower = (params: InputModGP) => {
  return GasificationPower(params);
};

export const hydrogen = (params: InputModHydrogen) => {
  return Hydrogen(params);
};

export const transmission = (params: InputModTransimission) => {
  return TransmissionCost(params);
};

export const substation = (params: InputModSubstation) => {
  return SubstationCost(params);
};

export const calculateEnergyRevenueRequired = (
  model: string,
  cashFlow: any
) => {
  let energyRevenueRequired = 0;
  switch (model) {
    case 'GPO':
      energyRevenueRequired =
        cashFlow.EquityRecovery +
        cashFlow.DebtRecovery +
        cashFlow.BiomassFuelCost +
        cashFlow.NonFuelExpenses +
        cashFlow.Taxes +
        cashFlow.DebtReserve -
        cashFlow.IncomeCapacity -
        cashFlow.InterestOnDebtReserve;
      break;
    case 'CHP':
      energyRevenueRequired =
        cashFlow.EquityRecovery +
        cashFlow.DebtRecovery +
        cashFlow.BiomassFuelCost +
        cashFlow.NonFuelExpenses +
        cashFlow.Taxes +
        cashFlow.DebtReserve -
        cashFlow.IncomeCapacity -
        cashFlow.InterestOnDebtReserve -
        cashFlow.IncomeHeat;
      break;
    case 'GP':
      energyRevenueRequired =
        cashFlow.EquityRecovery +
        cashFlow.DebtRecovery +
        cashFlow.BiomassFuelCost +
        cashFlow.DualFuelCost +
        cashFlow.NonFuelExpenses +
        cashFlow.Taxes +
        cashFlow.DebtReserve -
        cashFlow.IncomeCapacity -
        cashFlow.InterestOnDebtReserve -
        cashFlow.IncomeHeat -
        cashFlow.IncomeChar;
      break;
  }
  return energyRevenueRequired;
};

export const calculateEnergyRevenueRequiredPW = (
  Year: number,
  CostOfEquity: number,
  EnergyRevenueRequired: number
) => {
  return EnergyRevenueRequired * (1 + CostOfEquity / 100) ** -Year;
};

export const calculateCurrentLAC = (
  CostOfEquity: number,
  EconomicLife: number,
  TotalEnergyRevenueRequiredPW: number,
  AnnualGeneration: number
) => {
  const CostOfMoney = CostOfEquity / 100;
  const CapitalRecoveryFactorCurrent =
    (CostOfMoney * (1 + CostOfMoney)) **
    (EconomicLife / (1 + CostOfMoney) ** (EconomicLife - 1));
  const CurrentLACofEnergy =
    (TotalEnergyRevenueRequiredPW * CapitalRecoveryFactorCurrent) /
    AnnualGeneration;
  return CurrentLACofEnergy;
};

export const calculateConstantLAC = (
  CostOfEquity: number,
  GeneralInflation: number,
  EconomicLife: number,
  TotalEnergyRevenueRequiredPW: number,
  AnnualGeneration: number
) => {
  const RealCostOfMoney =
    (1 + CostOfEquity / 100) / (1 + GeneralInflation / 100) - 1;
  const CapitalRecoveryFactorConstant =
    (RealCostOfMoney * (1 + RealCostOfMoney)) **
    (EconomicLife / (1 + RealCostOfMoney) ** (EconomicLife - 1));
  const ConstantLACofEnergy =
    (TotalEnergyRevenueRequiredPW * CapitalRecoveryFactorConstant) /
    AnnualGeneration;
  return ConstantLACofEnergy;
};

const sensitivityCapitalCost = (
  model: string,
  input: any,
  base: number,
  low: number,
  high: number
) => {
  const increment1 = (base - low) / 10;
  const increment2 = (high - base) / 10;
  input.CapitalCost = base;
  const baseConstantLAC = GenericPowerOnly(input).ConstantLAC
    .ConstantLACofEnergy;
  const constantLAC = [];
  const relativeChange = [];
  let ithConstantLAC = 0;
  let ithRelativeChange = 0;
  for (let i = 0; i < 21; i++) {
    if (i < 11) {
      input.CapitalCost = increment1 * i;
    } else {
      input.CapitalCost = base + increment2 * (i - 10);
    }
    switch (model) {
      case 'GPO':
        ithConstantLAC = GenericPowerOnly(input).ConstantLAC
          .ConstantLACofEnergy;
        break;
      case 'CHP':
        ithConstantLAC = GenericCombinedHeatPower(input).ConstantLAC
          .ConstantLACofEnergy;
        break;
      case 'GP':
        ithConstantLAC = GasificationPower(input).ConstantLAC
          .ConstantLACofEnergy;
        break;
    }
    ithRelativeChange =
      ((ithConstantLAC - baseConstantLAC) / baseConstantLAC) * 100;
    constantLAC.push(ithConstantLAC);
    relativeChange.push(ithRelativeChange);
  }
  return { relativeChange, constantLAC };
};
