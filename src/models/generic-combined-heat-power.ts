import { InputModCHP } from './input.model';
import {
  CashFlowCHP,
  ConstantLevelAnnualCostMod,
  CurrentLevelAnnualCostMod,
  ElectricalFuelBaseYearModCHP,
  ExpensesBaseYearModGPO,
  FinancingMod,
  HeatBaseYearMod,
  IncomeOtherThanEnergyMod,
  OutputModCHP,
  SensitivityAnalysisMod,
  TotalCashFlowCHP
} from './output.model';

function GenericCombinedHeatPower(input: InputModCHP) {
  // Electrical and Fuel--base year
  const ParasiticLoad =
    input.ElectricalFuelBaseYear.GrossElectricalCapacity -
    input.ElectricalFuelBaseYear.NetElectricalCapacity;
  const AnnualHours =
    (input.ElectricalFuelBaseYear.CapacityFactor / 100) * 8760;
  input.ElectricalFuelBaseYear.FuelHeatingValue =
    input.ElectricalFuelBaseYear.FuelHeatingValue *
    (1 - input.ElectricalFuelBaseYear.MoistureContent / 100);
  const FuelConsumptionRate =
    ((input.ElectricalFuelBaseYear.NetElectricalCapacity /
      (input.ElectricalFuelBaseYear.NetStationEfficiency / 100)) *
      3600) /
    input.ElectricalFuelBaseYear.FuelHeatingValue /
    1000;
  const FuelPower =
    (FuelConsumptionRate *
      1000 *
      input.ElectricalFuelBaseYear.FuelHeatingValue) /
    3600;
  const GrossStationElectricalEfficiency =
    (input.ElectricalFuelBaseYear.GrossElectricalCapacity / FuelPower) * 100;
  const AnnualNetGeneration =
    (input.ElectricalFuelBaseYear.NetElectricalCapacity *
      8760 *
      input.ElectricalFuelBaseYear.CapacityFactor) /
    100;
  const AnnualFuelConsumption = FuelConsumptionRate * AnnualHours;
  const CapitalCostNEC =
    input.CapitalCost / input.ElectricalFuelBaseYear.NetElectricalCapacity;
  const AnnualAshDisposal =
    (AnnualFuelConsumption *
      input.ElectricalFuelBaseYear.FuelAshConcentration) /
    100;
  // Heat-base year
  const TotalHeatProductionRate =
    FuelPower - input.ElectricalFuelBaseYear.GrossElectricalCapacity;
  const RecoveredHeat =
    (TotalHeatProductionRate *
      input.HeatBaseYear.AggregateFractionOfHeatRecovered) /
    100;
  const AnnualHeatSales = RecoveredHeat * AnnualHours;
  const TotalIncomeFromHeatSales =
    AnnualHeatSales * input.HeatBaseYear.AggregateSalesPriceForHeat;
  const HeatIncomePerUnitNEE = TotalIncomeFromHeatSales / AnnualNetGeneration;
  const OverallCHPefficiencyGross =
    ((input.ElectricalFuelBaseYear.GrossElectricalCapacity * AnnualHours +
      AnnualHeatSales) /
      (FuelPower * AnnualHours)) *
    100;
  const OverallCHPefficiencyNet =
    ((AnnualNetGeneration + AnnualHeatSales) / (FuelPower * AnnualHours)) * 100;
  // Expenses--base year
  const TotalNonFuelExpenses =
    input.ExpensesBaseYear.LaborCost +
    input.ExpensesBaseYear.MaintenanceCost +
    input.ExpensesBaseYear.InsurancePropertyTax +
    input.ExpensesBaseYear.Utilities +
    input.ExpensesBaseYear.AshDisposal +
    input.ExpensesBaseYear.Management +
    input.ExpensesBaseYear.OtherOperatingExpenses;
  const TotalExpensesIncludingFuel =
    input.ExpensesBaseYear.BiomassFuelCost * AnnualFuelConsumption +
    TotalNonFuelExpenses;
  const FuelCostKwh = CalcKwh(
    AnnualFuelConsumption * input.ExpensesBaseYear.BiomassFuelCost
  );
  const LaborCostKwh = CalcKwh(input.ExpensesBaseYear.LaborCost);
  const MaintenanceCostKwh = CalcKwh(input.ExpensesBaseYear.MaintenanceCost);
  const InsurancePropertyTaxKwh = CalcKwh(
    input.ExpensesBaseYear.InsurancePropertyTax
  );
  const UtilitiesKwh = CalcKwh(input.ExpensesBaseYear.Utilities);
  const AshDisposalKwh = CalcKwh(input.ExpensesBaseYear.AshDisposal);
  const ManagementKwh = CalcKwh(input.ExpensesBaseYear.Management);
  const OtherOperatingExpensesKwh = CalcKwh(
    input.ExpensesBaseYear.OtherOperatingExpenses
  );
  const TotalNonFuelExpensesKwh =
    LaborCostKwh +
    MaintenanceCostKwh +
    InsurancePropertyTaxKwh +
    UtilitiesKwh +
    AshDisposalKwh +
    ManagementKwh +
    OtherOperatingExpensesKwh;
  const TotalExpensesIncludingFuelKwh = FuelCostKwh + TotalNonFuelExpensesKwh;
  function CalcKwh(cost: number) {
    return cost / AnnualNetGeneration;
  }
  // Taxes
  const CombinedTaxRate =
    input.StateTaxRate + input.FederalTaxRate * (1 - input.StateTaxRate / 100);
  // Financing
  const EquityRatio = 100 - input.DebtRatio;
  const CostOfMoney =
    (input.DebtRatio / 100) * input.InterestRateOnDebt +
    (EquityRatio / 100) * input.CostOfEquity;
  const TotalCostOfPlant = input.CapitalCost;
  const TotalEquityCost = (TotalCostOfPlant * EquityRatio) / 100;
  const TotalDebtCost = (TotalCostOfPlant * input.DebtRatio) / 100;
  const CapitalRecoveryFactorEquity = CapitalRecoveryFactor(
    input.CostOfEquity,
    input.EconomicLife
  );
  const CapitalRecoveryFactorDebt = CapitalRecoveryFactor(
    input.InterestRateOnDebt,
    input.EconomicLife
  );
  const AnnualEquityRecovery = CapitalRecoveryFactorEquity * TotalEquityCost;
  const AnnualDebtPayment = TotalDebtCost * CapitalRecoveryFactorDebt;
  const DebtReserve = AnnualDebtPayment;
  function CapitalRecoveryFactor(i: number, N: number) {
    const A =
      ((i / 100) * Math.pow(1 + i / 100, N)) / (Math.pow(1 + i / 100, N) - 1);
    return A;
  }
  // Income other than energy
  const AnnualCapacityPayment =
    input.CapacityPayment * input.ElectricalFuelBaseYear.NetElectricalCapacity;
  const AnnualDebtReserveInterest =
    (DebtReserve * input.InterestRateOnDebtReserve) / 100;
  // Depreciation Schedule
  const DepreciationFraction = 1 / input.EconomicLife;
  // Annual Cash Flows
  const cashFlow = [];
  for (let i = 0; i < input.EconomicLife; i++) {
    const newCF: CashFlowCHP = {
      Year: 0,
      EquityRecovery: 0,
      EquityInterest: 0,
      EquityPrincipalPaid: 0,
      EquityPrincipalRemaining: 0,
      DebtRecovery: 0,
      DebtInterest: 0,
      DebtPrincipalPaid: 0,
      DebtPrincipalRemaining: 0,
      NonFuelExpenses: 0,
      DebtReserve: 0,
      Depreciation: 0,
      IncomeCapacity: 0,
      InterestOnDebtReserve: 0,
      TaxesWoCredit: 0,
      TaxCredit: 0,
      Taxes: 0,
      EnergyRevenueRequired: 0,
      FuelCost: 0,
      IncomeHeat: 0
    };
    cashFlow.push(newCF);
  }
  for (let i = 0; i < input.EconomicLife; i++) {
    cashFlow[i] = CalcCashFlow(cashFlow[i - 1], i + 1);
  }
  function CalcCashFlow(CF: CashFlowCHP, Year: number) {
    const newCF: CashFlowCHP = {
      Year: 0,
      EquityRecovery: 0,
      EquityInterest: 0,
      EquityPrincipalPaid: 0,
      EquityPrincipalRemaining: 0,
      DebtRecovery: 0,
      DebtInterest: 0,
      DebtPrincipalPaid: 0,
      DebtPrincipalRemaining: 0,
      NonFuelExpenses: 0,
      DebtReserve: 0,
      Depreciation: 0,
      IncomeCapacity: 0,
      InterestOnDebtReserve: 0,
      TaxesWoCredit: 0,
      TaxCredit: 0,
      Taxes: 0,
      EnergyRevenueRequired: 0,
      FuelCost: 0,
      IncomeHeat: 0
    };
    newCF.Year = Year;
    newCF.EquityRecovery = AnnualEquityRecovery;
    if (Year === 1) {
      newCF.EquityInterest = (input.CostOfEquity / 100) * TotalEquityCost;
    } else {
      newCF.EquityInterest =
        (input.CostOfEquity / 100) * CF.EquityPrincipalRemaining;
    }
    newCF.EquityPrincipalPaid = newCF.EquityRecovery - newCF.EquityInterest;
    if (Year === 1) {
      newCF.EquityPrincipalRemaining =
        TotalEquityCost - newCF.EquityPrincipalPaid;
    } else {
      newCF.EquityPrincipalRemaining =
        CF.EquityPrincipalRemaining - newCF.EquityPrincipalPaid;
    }
    newCF.DebtRecovery = AnnualDebtPayment;
    if (Year === 1) {
      newCF.DebtInterest = (input.InterestRateOnDebt / 100) * TotalDebtCost;
    } else {
      newCF.DebtInterest =
        (input.InterestRateOnDebt / 100) * CF.DebtPrincipalRemaining;
    }
    newCF.DebtPrincipalPaid = newCF.DebtRecovery - newCF.DebtInterest;
    if (Year === 1) {
      newCF.DebtPrincipalRemaining = TotalDebtCost - newCF.DebtPrincipalPaid;
    } else {
      newCF.DebtPrincipalRemaining =
        CF.DebtPrincipalRemaining - newCF.DebtPrincipalPaid;
    }
    newCF.FuelCost =
      AnnualFuelConsumption *
      input.ExpensesBaseYear.BiomassFuelCost *
      Math.pow(
        1 + input.EscalationInflation.EscalationBiomassFuel / 100,
        Year - 1
      );
    newCF.NonFuelExpenses =
      TotalNonFuelExpenses *
      Math.pow(1 + input.EscalationInflation.EscalationOther / 100, Year - 1);
    if (Year === 1) {
      newCF.DebtReserve = DebtReserve;
    } else if (Year < input.EconomicLife) {
      newCF.DebtReserve = 0;
    } else {
      newCF.DebtReserve = -DebtReserve;
    }
    newCF.Depreciation = TotalCostOfPlant * DepreciationFraction;
    newCF.IncomeCapacity = AnnualCapacityPayment;
    if (Year === 1) {
      newCF.IncomeHeat = TotalIncomeFromHeatSales;
    } else {
      newCF.IncomeHeat =
        TotalIncomeFromHeatSales *
        Math.pow(
          1 + input.EscalationInflation.EscalationHeatSales / 100,
          Year - 1
        );
    }
    newCF.InterestOnDebtReserve = AnnualDebtReserveInterest;
    newCF.TaxesWoCredit =
      (CombinedTaxRate / 100 / (1 - CombinedTaxRate / 100)) *
      (newCF.EquityPrincipalPaid +
        newCF.DebtPrincipalPaid +
        newCF.EquityInterest -
        newCF.Depreciation +
        newCF.DebtReserve);
    newCF.TaxCredit =
      AnnualNetGeneration *
      input.ProductionTaxCredit *
      Math.pow(
        1 + input.EscalationInflation.EscalationProductionTaxCredit / 100,
        Year - 1
      ) *
      input.TaxCreditFrac[Year - 1];
    newCF.Taxes =
      (CombinedTaxRate / 100 / (1 - CombinedTaxRate / 100)) *
      (newCF.EquityPrincipalPaid +
        newCF.DebtPrincipalPaid +
        newCF.EquityInterest -
        newCF.Depreciation +
        newCF.DebtReserve -
        newCF.TaxCredit);
    newCF.EnergyRevenueRequired =
      newCF.EquityRecovery +
      newCF.DebtRecovery +
      newCF.FuelCost +
      newCF.NonFuelExpenses +
      newCF.Taxes +
      newCF.DebtReserve -
      newCF.IncomeCapacity -
      newCF.InterestOnDebtReserve -
      newCF.IncomeHeat;

    return newCF;
  }

  const Total: TotalCashFlowCHP = {
    EquityRecovery: 0,
    EquityInterest: 0,
    EquityPrincipalPaid: 0,
    DebtRecovery: 0,
    DebtInterest: 0,
    DebtPrincipalPaid: 0,
    NonFuelExpenses: 0,
    DebtReserve: 0,
    Depreciation: 0,
    IncomeCapacity: 0,
    InterestOnDebtReserve: 0,
    TaxesWoCredit: 0,
    TaxCredit: 0,
    Taxes: 0,
    EnergyRevenueRequired: 0,
    FuelCost: 0,
    IncomeHeat: 0
  };
  for (let i = 0; i < cashFlow.length; i++) {
    Total.EquityRecovery += cashFlow[i].EquityRecovery;
    Total.EquityInterest += cashFlow[i].EquityInterest;
    Total.EquityPrincipalPaid += cashFlow[i].EquityPrincipalPaid;
    Total.DebtRecovery += cashFlow[i].DebtRecovery;
    Total.DebtInterest += cashFlow[i].DebtInterest;
    Total.DebtPrincipalPaid += cashFlow[i].DebtPrincipalPaid;
    Total.FuelCost += cashFlow[i].FuelCost;
    Total.NonFuelExpenses += cashFlow[i].NonFuelExpenses;
    Total.DebtReserve += cashFlow[i].DebtReserve;
    Total.Depreciation += cashFlow[i].Depreciation;
    Total.IncomeCapacity += cashFlow[i].IncomeCapacity;
    Total.IncomeHeat += cashFlow[i].IncomeHeat;
    Total.InterestOnDebtReserve += cashFlow[i].InterestOnDebtReserve;
    Total.TaxesWoCredit += cashFlow[i].TaxesWoCredit;
    Total.TaxCredit += cashFlow[i].TaxCredit;
    Total.Taxes += cashFlow[i].Taxes;
    Total.EnergyRevenueRequired += cashFlow[i].EnergyRevenueRequired;
  }
  // Current $ Level Annual Cost (LAC)
  const PresentWorth = [];
  let TotalPresentWorth = 0;
  for (let i = 0; i < cashFlow.length; i++) {
    const newPW = PW(
      cashFlow[i].EnergyRevenueRequired,
      input.CostOfEquity,
      i + 1
    );
    PresentWorth.push(newPW);
    TotalPresentWorth += newPW;
  }
  const CapitalRecoveryFactorCurrent = CapitalRecoveryFactorEquity;
  const CurrentLevelAnnualRevenueRequirements =
    CapitalRecoveryFactorCurrent * TotalPresentWorth;
  const CurrentLACofEnergy =
    CurrentLevelAnnualRevenueRequirements / AnnualNetGeneration;
  function PW(
    EnergyRevenueRequired: number,
    CostOfEquity: number,
    Year: number
  ) {
    return EnergyRevenueRequired * Math.pow(1 + CostOfEquity / 100, -Year);
  }
  const RealCostOfMoney =
    (1 + input.CostOfEquity / 100) /
      (1 + input.EscalationInflation.GeneralInflation / 100) -
    1;
  const CapitalRecoveryFactorConstant = CapitalRecoveryFactor(
    RealCostOfMoney * 100,
    input.EconomicLife
  );
  const ConstantLevelAnnualRevenueRequirements =
    TotalPresentWorth * CapitalRecoveryFactorConstant;
  const ConstantLACofEnergy =
    ConstantLevelAnnualRevenueRequirements / AnnualNetGeneration;

  const ElectricalFuelBaseYear: ElectricalFuelBaseYearModCHP = {
    AnnualHours: 0,
    FuelConsumptionRate: 0,
    AnnualGeneration: 0,
    CapitalCostNEC: 0,
    AnnualFuelConsumption: 0,
    AnnualAshDisposal: 0,
    ParasiticLoad: 0,
    FuelPower: 0,
    GrossStationElectricalEfficiency: 0
  };
  ElectricalFuelBaseYear.AnnualHours = AnnualHours;
  ElectricalFuelBaseYear.FuelConsumptionRate = FuelConsumptionRate;
  ElectricalFuelBaseYear.AnnualGeneration = AnnualNetGeneration;
  ElectricalFuelBaseYear.CapitalCostNEC = CapitalCostNEC;
  ElectricalFuelBaseYear.AnnualFuelConsumption = AnnualFuelConsumption;
  ElectricalFuelBaseYear.AnnualAshDisposal = AnnualAshDisposal;
  ElectricalFuelBaseYear.ParasiticLoad = ParasiticLoad;
  ElectricalFuelBaseYear.FuelPower = FuelPower;
  ElectricalFuelBaseYear.GrossStationElectricalEfficiency = GrossStationElectricalEfficiency;
  const HeatBaseYear: HeatBaseYearMod = {
    TotalHeatProductionRate: 0,
    RecoveredHeat: 0,
    AnnualHeatSales: 0,
    TotalIncomeFromHeatSales: 0,
    HeatIncomePerUnitNEE: 0,
    OverallCHPefficiencyGross: 0,
    OverallCHPefficiencyNet: 0
  };
  HeatBaseYear.TotalHeatProductionRate = TotalHeatProductionRate;
  HeatBaseYear.RecoveredHeat = RecoveredHeat;
  HeatBaseYear.AnnualHeatSales = AnnualHeatSales;
  HeatBaseYear.TotalIncomeFromHeatSales = TotalIncomeFromHeatSales;
  HeatBaseYear.HeatIncomePerUnitNEE = HeatIncomePerUnitNEE;
  HeatBaseYear.OverallCHPefficiencyGross = OverallCHPefficiencyGross;
  HeatBaseYear.OverallCHPefficiencyNet = OverallCHPefficiencyNet;
  const ExpensesBaseYear: ExpensesBaseYearModGPO = {
    TotalNonFuelExpenses: 0,
    TotalExpensesIncludingFuel: 0,
    LaborCostKwh: 0,
    MaintenanceCostKwh: 0,
    InsurancePropertyTaxKwh: 0,
    UtilitiesKwh: 0,
    ManagementKwh: 0,
    OtherOperatingExpensesKwh: 0,
    TotalNonFuelExpensesKwh: 0,
    TotalExpensesIncludingFuelKwh: 0,
    FuelCostKwh: 0,
    AshDisposalKwh: 0
  };
  ExpensesBaseYear.TotalNonFuelExpenses = TotalNonFuelExpenses;
  ExpensesBaseYear.TotalExpensesIncludingFuel = TotalExpensesIncludingFuel;
  ExpensesBaseYear.FuelCostKwh = FuelCostKwh;
  ExpensesBaseYear.LaborCostKwh = LaborCostKwh;
  ExpensesBaseYear.MaintenanceCostKwh = MaintenanceCostKwh;
  ExpensesBaseYear.InsurancePropertyTaxKwh = InsurancePropertyTaxKwh;
  ExpensesBaseYear.UtilitiesKwh = UtilitiesKwh;
  ExpensesBaseYear.AshDisposalKwh = AshDisposalKwh;
  ExpensesBaseYear.ManagementKwh = ManagementKwh;
  ExpensesBaseYear.OtherOperatingExpensesKwh = OtherOperatingExpensesKwh;
  ExpensesBaseYear.TotalNonFuelExpensesKwh = TotalNonFuelExpensesKwh;
  ExpensesBaseYear.TotalExpensesIncludingFuelKwh = TotalExpensesIncludingFuelKwh;
  const IncomeOtherThanEnergy: IncomeOtherThanEnergyMod = {
    AnnualCapacityPayment: 0,
    AnnualDebtReserveInterest: 0
  };
  IncomeOtherThanEnergy.AnnualCapacityPayment = AnnualCapacityPayment;
  IncomeOtherThanEnergy.AnnualDebtReserveInterest = AnnualDebtReserveInterest;
  const Financing: FinancingMod = {
    EquityRatio: 0,
    CostOfMoney: 0,
    TotalCostOfPlant: 0,
    TotalEquityCost: 0,
    TotalDebtCost: 0,
    CapitalRecoveryFactorEquity: 0,
    CapitalRecoveryFactorDebt: 0,
    AnnualEquityRecovery: 0,
    AnnualDebtPayment: 0,
    DebtReserve: 0
  };
  Financing.EquityRatio = EquityRatio;
  Financing.CostOfMoney = CostOfMoney;
  Financing.TotalCostOfPlant = TotalCostOfPlant;
  Financing.TotalEquityCost = TotalEquityCost;
  Financing.TotalDebtCost = TotalDebtCost;
  Financing.CapitalRecoveryFactorEquity = CapitalRecoveryFactorEquity;
  Financing.CapitalRecoveryFactorDebt = CapitalRecoveryFactorDebt;
  Financing.AnnualEquityRecovery = AnnualEquityRecovery;
  Financing.AnnualDebtPayment = AnnualDebtPayment;
  Financing.DebtReserve = DebtReserve;
  const CurrentLevelAnnualCost: CurrentLevelAnnualCostMod = {
    CostOfMoney: 0,
    PresentWorth: [],
    TotalPresentWorth: 0,
    CapitalRecoveryFactorCurrent: 0,
    CurrentLevelAnnualRevenueRequirements: 0,
    CurrentLACofEnergy: 0
  };
  CurrentLevelAnnualCost.CostOfMoney = input.CostOfEquity / 100;
  CurrentLevelAnnualCost.PresentWorth = PresentWorth;
  CurrentLevelAnnualCost.TotalPresentWorth = TotalPresentWorth;
  CurrentLevelAnnualCost.CapitalRecoveryFactorCurrent = CapitalRecoveryFactorCurrent;
  CurrentLevelAnnualCost.CurrentLevelAnnualRevenueRequirements = CurrentLevelAnnualRevenueRequirements;
  CurrentLevelAnnualCost.CurrentLACofEnergy = CurrentLACofEnergy;
  const ConstantLevelAnnualCost: ConstantLevelAnnualCostMod = {
    RealCostOfMoney: 0,
    CapitalRecoveryFactorConstant: 0,
    ConstantLevelAnnualRevenueRequirements: 0,
    ConstantLACofEnergy: 0
  };
  ConstantLevelAnnualCost.RealCostOfMoney = RealCostOfMoney;
  ConstantLevelAnnualCost.CapitalRecoveryFactorConstant = CapitalRecoveryFactorConstant;
  ConstantLevelAnnualCost.ConstantLevelAnnualRevenueRequirements = ConstantLevelAnnualRevenueRequirements;
  ConstantLevelAnnualCost.ConstantLACofEnergy = ConstantLACofEnergy;
  const SensitivityAnalysis: SensitivityAnalysisMod = {
    LACcurrent: CurrentLACofEnergy,
    LACconstant: ConstantLACofEnergy
  };

  const Output: OutputModCHP = {
    SensitivityAnalysis: SensitivityAnalysis,
    CombinedTaxRate: CombinedTaxRate,
    Financing: Financing,
    CurrentLAC: CurrentLevelAnnualCost,
    ConstantLAC: ConstantLevelAnnualCost,
    ElectricalAndFuelBaseYear: ElectricalFuelBaseYear,
    HeatBaseYear: HeatBaseYear,
    ExpensesBaseYear: ExpensesBaseYear,
    IncomeOtherThanEnergy: IncomeOtherThanEnergy,
    AnnualCashFlows: cashFlow,
    TotalCashFlow: Total
  };

  return Output;
}

export { GenericCombinedHeatPower };
