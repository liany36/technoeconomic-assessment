import { GasificationPower } from './gasification-power';
import { GenericCombinedHeatPower } from './generic-combined-heat-power';
import { GenericPowerOnly } from './generic-power-only';
import { Hydrogen } from './hydrogen';
import {
  InputModCHP,
  InputModGP,
  InputModGPO,
  InputModHydrogen,
  InputModSubstation,
  InputModTransimission,
} from './input.model';
import { SubstationCost } from './substation';
import { TransmissionCost } from './transmission';

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

export const computeEnergyRevenueRequired = (
  model: string,
  cashFlow: any,
  includeCarbonCredit: boolean
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
  if (includeCarbonCredit) {
    energyRevenueRequired -= cashFlow.LcfsCreditRevenue;
  }
  return energyRevenueRequired;
};

export const computeEnergyRevenueRequiredPW = (
  Year: number,
  CostOfEquity: number,
  EnergyRevenueRequired: number
) => {
  return EnergyRevenueRequired * (1 + CostOfEquity / 100) ** -Year;
};

export const computeCurrentLAC = (
  CostOfEquity: number,
  EconomicLife: number,
  TotalEnergyRevenueRequiredPW: number,
  AnnualGeneration: number
) => {
  const CostOfMoney = CostOfEquity / 100;
  const CapitalRecoveryFactorCurrent =
    (CostOfMoney * (1 + CostOfMoney) ** EconomicLife) /
    ((1 + CostOfMoney) ** EconomicLife - 1);
  const CurrentLACofEnergy =
    (TotalEnergyRevenueRequiredPW * CapitalRecoveryFactorCurrent) /
    AnnualGeneration;
  return CurrentLACofEnergy;
};

export const computeConstantLAC = (
  CostOfEquity: number,
  GeneralInflation: number,
  EconomicLife: number,
  TotalEnergyRevenueRequiredPW: number,
  AnnualGeneration: number
) => {
  const RealCostOfMoney =
    (1 + CostOfEquity / 100) / (1 + GeneralInflation / 100) - 1;
  const CapitalRecoveryFactorConstant =
    (RealCostOfMoney * (1 + RealCostOfMoney) ** EconomicLife) /
    ((1 + RealCostOfMoney) ** EconomicLife - 1);
  const ConstantLACofEnergy =
    (TotalEnergyRevenueRequiredPW * CapitalRecoveryFactorConstant) /
    AnnualGeneration;
  return ConstantLACofEnergy;
};

export const computeCarbonCredit = (
  currentYear: number,
  firstYear: number,
  carbonCreditPrice: number,
  carbonIntensity: number,
  energyEconomyRatio: number,
  escalationRate: number, // in percentage
  annualElectricGeneration: number
): number => {
  let lcfsCreditRevenue = 0;
  const DieselComplianceStandard = -1.3705 * currentYear + 2862.1; // gCO2e/MJ
  const CreditPrice = // $/tonne
    carbonCreditPrice * (1 + escalationRate / 100) ** (currentYear - firstYear);
  const KWH_TO_MJ = 3.6; // 1 kWh = 3.6 MJ
  const TONNE_TO_GRAM = 1_000_000; // 1 tonne = 1,000,000 grams
  if (DieselComplianceStandard * energyEconomyRatio > carbonIntensity) {
    lcfsCreditRevenue =
      ((DieselComplianceStandard * energyEconomyRatio - carbonIntensity) /
        TONNE_TO_GRAM) *
      KWH_TO_MJ *
      CreditPrice *
      annualElectricGeneration;
  }
  return lcfsCreditRevenue;
};
