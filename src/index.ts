import { GasificationPower } from './models/gasification-power';
import { GenericCombinedHeatPower } from './models/generic-combined-heat-power';
import { GenericPowerOnly } from './models/generic-power-only';
import { Hydrogen } from './models/hydrogen';
import {
  InputModCHP,
  InputModGP,
  InputModGPO,
  InputModHydrogen,
  InputModSensitivity,
  InputModSubstation,
  InputModTransimission,
} from './models/input.model';
import { sensitivity } from './models/sensitivity';
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
        cashFlow.InterestOnDebtReserve -
        cashFlow.LcfsCreditRevenue;
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
    CostOfMoney * (1 + CostOfMoney) ** EconomicLife / ((1 + CostOfMoney) ** EconomicLife - 1);
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
    RealCostOfMoney * (1 + RealCostOfMoney) ** EconomicLife / ((1 + RealCostOfMoney) ** EconomicLife - 1);
  const ConstantLACofEnergy =
    (TotalEnergyRevenueRequiredPW * CapitalRecoveryFactorConstant) /
    AnnualGeneration;
  return ConstantLACofEnergy;
};

export const calculateSensitivity = (params: InputModSensitivity) => {
  return sensitivity(params);
};
