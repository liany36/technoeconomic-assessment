import { InputModGPO } from './input.model';
import {
  CashFlow,
  ConstantLevelAnnualCostMod,
  CurrentLevelAnnualCostMod,
  ElectricalFuelBaseYearModGPO,
  ExpensesBaseYearModGPO,
  FinancingMod,
  IncomeOtherThanEnergyMod,
  OutputModGPO,
  SensitivityAnalysisMod,
  TotalCashFlow,
} from './output.model';

function GenericPowerOnly(input: InputModGPO) {
  // Electrical and Fuel--base year
  const AnnualHours =
    (input.ElectricalFuelBaseYear.CapacityFactor / 100) * 8760;
  const FuelHeatingValue =
    input.ElectricalFuelBaseYear.FuelHeatingValue *
    (1 - input.ElectricalFuelBaseYear.MoistureContent / 100);
  const FuelConsumptionRate =
    ((input.ElectricalFuelBaseYear.NetElectricalCapacity /
      (input.ElectricalFuelBaseYear.NetStationEfficiency / 100)) *
      3600) /
    FuelHeatingValue /
    1000;
  const AnnualGeneration =
    (input.ElectricalFuelBaseYear.NetElectricalCapacity *
      8760 *
      input.ElectricalFuelBaseYear.CapacityFactor) /
    100;
  const CapitalCostNEC =
    input.CapitalCost / input.ElectricalFuelBaseYear.NetElectricalCapacity;
  const AnnualFuelConsumption = FuelConsumptionRate * AnnualHours;
  const AnnualAshDisposal =
    (AnnualFuelConsumption *
      input.ElectricalFuelBaseYear.FuelAshConcentration) /
    100;
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
    return cost / AnnualGeneration;
  }
  // Taxes
  const CombinedTaxRate =
    input.Taxes.StateTaxRate +
    input.Taxes.FederalTaxRate * (1 - input.Taxes.StateTaxRate / 100);
  // Financing
  const EquityRatio = 100 - input.Financing.DebtRatio;
  const CostOfMoney =
    (input.Financing.DebtRatio / 100) * input.Financing.InterestRateOnDebt +
    (EquityRatio / 100) * input.Financing.CostOfEquity;
  const TotalCostOfPlant = input.CapitalCost;
  const TotalEquityCost = (TotalCostOfPlant * EquityRatio) / 100;
  const TotalDebtCost = (TotalCostOfPlant * input.Financing.DebtRatio) / 100;
  const CapitalRecoveryFactorEquity = CapitalRecoveryFactor(
    input.Financing.CostOfEquity,
    input.Financing.EconomicLife
  );
  const CapitalRecoveryFactorDebt = CapitalRecoveryFactor(
    input.Financing.InterestRateOnDebt,
    input.Financing.EconomicLife
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
    input.IncomeOtherThanEnergy.CapacityPayment *
    input.ElectricalFuelBaseYear.NetElectricalCapacity;
  const AnnualDebtReserveInterest =
    (DebtReserve * input.IncomeOtherThanEnergy.InterestRateOnDebtReserve) / 100;
  // Depreciation Schedule
  const DepreciationFraction = 1 / input.Financing.EconomicLife;
  // Annual Cash Flows
  const cashFlow = [];
  for (let i = 0; i < input.Financing.EconomicLife; i++) {
    const newCF: CashFlow = {
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
      LcfsCreditRevenue: 0,
      EnergyRevenueRequired: 0,
      BiomassFuelCost: 0,
    };
    cashFlow.push(newCF);
  }
  for (let i = 0; i < input.Financing.EconomicLife; i++) {
    cashFlow[i] = CalcCashFlow(cashFlow[i - 1], i + 1);
  }
  function CalcCashFlow(CF: CashFlow, Year: number) {
    const newCF: CashFlow = {
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
      LcfsCreditRevenue: 0,
      EnergyRevenueRequired: 0,
      BiomassFuelCost: 0,
    };
    newCF.Year = Year;
    newCF.EquityRecovery = AnnualEquityRecovery;
    if (Year === 1) {
      newCF.EquityInterest =
        (input.Financing.CostOfEquity / 100) * TotalEquityCost;
    } else {
      newCF.EquityInterest =
        (input.Financing.CostOfEquity / 100) * CF.EquityPrincipalRemaining;
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
      newCF.DebtInterest =
        (input.Financing.InterestRateOnDebt / 100) * TotalDebtCost;
    } else {
      newCF.DebtInterest =
        (input.Financing.InterestRateOnDebt / 100) * CF.DebtPrincipalRemaining;
    }
    newCF.DebtPrincipalPaid = newCF.DebtRecovery - newCF.DebtInterest;
    if (Year === 1) {
      newCF.DebtPrincipalRemaining = TotalDebtCost - newCF.DebtPrincipalPaid;
    } else {
      newCF.DebtPrincipalRemaining =
        CF.DebtPrincipalRemaining - newCF.DebtPrincipalPaid;
    }
    newCF.BiomassFuelCost =
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
    } else if (Year < input.Financing.EconomicLife) {
      newCF.DebtReserve = 0;
    } else {
      newCF.DebtReserve = -DebtReserve;
    }
    newCF.Depreciation = TotalCostOfPlant * DepreciationFraction;
    newCF.IncomeCapacity = AnnualCapacityPayment;
    newCF.InterestOnDebtReserve = AnnualDebtReserveInterest;
    newCF.TaxesWoCredit =
      (CombinedTaxRate / 100 / (1 - CombinedTaxRate / 100)) *
      (newCF.EquityPrincipalPaid +
        newCF.DebtPrincipalPaid +
        newCF.EquityInterest -
        newCF.Depreciation +
        newCF.DebtReserve);
    newCF.TaxCredit =
      AnnualGeneration *
      input.Taxes.ProductionTaxCredit *
      Math.pow(
        1 + input.EscalationInflation.EscalationProductionTaxCredit / 100,
        Year - 1
      ) *
      input.TaxCreditFrac[Year - 1];
    // LCFS credit
    const DieselComplianceStandard = -1.3705 * (Year + 2015) + 2862.1; // gCO2e/MJ
    const CreditPrice = // $/tonne
      input.CarbonCredit.CreditPrice *
      Math.pow(1 + input.EscalationInflation.GeneralInflation / 100, Year - 1);
    const KWH_TO_MJ = 3.6; // 1 kWh = 3.6 MJ
    const TONNE_TO_GRAM = 1_000_000; // 1 tonne = 1,000,000 grams
    if (
      DieselComplianceStandard * input.CarbonCredit.EnergyEconomyRatio >
      input.CarbonCredit.CIscore
    ) {
      newCF.LcfsCreditRevenue =
        ((DieselComplianceStandard * input.CarbonCredit.EnergyEconomyRatio -
          input.CarbonCredit.CIscore) /
          TONNE_TO_GRAM) *
        KWH_TO_MJ *
        CreditPrice *
        AnnualGeneration;
    }
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
      newCF.BiomassFuelCost +
      newCF.NonFuelExpenses +
      newCF.Taxes +
      newCF.DebtReserve -
      newCF.IncomeCapacity -
      newCF.InterestOnDebtReserve;
    if (input.IncludeCarbonCredit) {
      newCF.EnergyRevenueRequired -= newCF.LcfsCreditRevenue;
    }

    return newCF;
  }

  const Total: TotalCashFlow = {
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
    LcfsCreditRevenue: 0,
    EnergyRevenueRequired: 0,
    BiomassFuelCost: 0,
  };
  for (let i = 0; i < cashFlow.length; i++) {
    Total.EquityRecovery += cashFlow[i].EquityRecovery;
    Total.EquityInterest += cashFlow[i].EquityInterest;
    Total.EquityPrincipalPaid += cashFlow[i].EquityPrincipalPaid;
    Total.DebtRecovery += cashFlow[i].DebtRecovery;
    Total.DebtInterest += cashFlow[i].DebtInterest;
    Total.DebtPrincipalPaid += cashFlow[i].DebtPrincipalPaid;
    Total.BiomassFuelCost += cashFlow[i].BiomassFuelCost;
    Total.NonFuelExpenses += cashFlow[i].NonFuelExpenses;
    Total.DebtReserve += cashFlow[i].DebtReserve;
    Total.Depreciation += cashFlow[i].Depreciation;
    Total.IncomeCapacity += cashFlow[i].IncomeCapacity;
    Total.InterestOnDebtReserve += cashFlow[i].InterestOnDebtReserve;
    Total.TaxesWoCredit += cashFlow[i].TaxesWoCredit;
    Total.TaxCredit += cashFlow[i].TaxCredit;
    Total.Taxes += cashFlow[i].Taxes;
    Total.LcfsCreditRevenue += cashFlow[i].LcfsCreditRevenue;
    Total.EnergyRevenueRequired += cashFlow[i].EnergyRevenueRequired;
  }
  // Current $ Level Annual Cost (LAC)
  const PresentWorth = [];
  let TotalPresentWorth = 0;
  for (let i = 0; i < cashFlow.length; i++) {
    const newPW = PW(
      cashFlow[i].EnergyRevenueRequired,
      input.Financing.CostOfEquity,
      i + 1
    );
    PresentWorth.push(newPW);
    TotalPresentWorth += newPW;
  }
  const CapitalRecoveryFactorCurrent = CapitalRecoveryFactorEquity;
  const CurrentLevelAnnualRevenueRequirements =
    CapitalRecoveryFactorCurrent * TotalPresentWorth;
  const CurrentLACofEnergy =
    CurrentLevelAnnualRevenueRequirements / AnnualGeneration;
  function PW(
    EnergyRevenueRequired: number,
    CostOfEquity: number,
    Year: number
  ) {
    return EnergyRevenueRequired * Math.pow(1 + CostOfEquity / 100, -Year);
  }
  const RealCostOfMoney =
    (1 + input.Financing.CostOfEquity / 100) /
      (1 + input.EscalationInflation.GeneralInflation / 100) -
    1;
  const CapitalRecoveryFactorConstant = CapitalRecoveryFactor(
    RealCostOfMoney * 100,
    input.Financing.EconomicLife
  );
  const ConstantLevelAnnualRevenueRequirements =
    TotalPresentWorth * CapitalRecoveryFactorConstant;
  const ConstantLACofEnergy =
    ConstantLevelAnnualRevenueRequirements / AnnualGeneration;

  const ElectricalFuelBaseYear: ElectricalFuelBaseYearModGPO = {
    AnnualHours: 0,
    BiomassTarget: 0,
    FuelConsumptionRate: 0,
    AnnualGeneration: 0,
    CapitalCostNEC: 0,
    AnnualFuelConsumption: 0,
    AnnualAshDisposal: 0,
  };
  ElectricalFuelBaseYear.AnnualHours = AnnualHours;
  ElectricalFuelBaseYear.BiomassTarget = AnnualFuelConsumption;
  ElectricalFuelBaseYear.FuelConsumptionRate = FuelConsumptionRate;
  ElectricalFuelBaseYear.AnnualGeneration = AnnualGeneration;
  ElectricalFuelBaseYear.CapitalCostNEC = CapitalCostNEC;
  ElectricalFuelBaseYear.AnnualFuelConsumption = AnnualFuelConsumption;
  ElectricalFuelBaseYear.AnnualAshDisposal = AnnualAshDisposal;
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
    AshDisposalKwh: 0,
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
  ExpensesBaseYear.TotalExpensesIncludingFuelKwh =
    TotalExpensesIncludingFuelKwh;
  const IncomeOtherThanEnergy: IncomeOtherThanEnergyMod = {
    AnnualCapacityPayment: 0,
    AnnualDebtReserveInterest: 0,
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
    DebtReserve: 0,
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
    CurrentLACofEnergy: 0,
  };
  CurrentLevelAnnualCost.CostOfMoney = input.Financing.CostOfEquity / 100;
  CurrentLevelAnnualCost.PresentWorth = PresentWorth;
  CurrentLevelAnnualCost.TotalPresentWorth = TotalPresentWorth;
  CurrentLevelAnnualCost.CapitalRecoveryFactorCurrent =
    CapitalRecoveryFactorCurrent;
  CurrentLevelAnnualCost.CurrentLevelAnnualRevenueRequirements =
    CurrentLevelAnnualRevenueRequirements;
  CurrentLevelAnnualCost.CurrentLACofEnergy = CurrentLACofEnergy;
  const ConstantLevelAnnualCost: ConstantLevelAnnualCostMod = {
    RealCostOfMoney: 0,
    CapitalRecoveryFactorConstant: 0,
    ConstantLevelAnnualRevenueRequirements: 0,
    ConstantLACofEnergy: 0,
  };
  ConstantLevelAnnualCost.RealCostOfMoney = RealCostOfMoney;
  ConstantLevelAnnualCost.CapitalRecoveryFactorConstant =
    CapitalRecoveryFactorConstant;
  ConstantLevelAnnualCost.ConstantLevelAnnualRevenueRequirements =
    ConstantLevelAnnualRevenueRequirements;
  ConstantLevelAnnualCost.ConstantLACofEnergy = ConstantLACofEnergy;
  const SensitivityAnalysis: SensitivityAnalysisMod = {
    LACcurrent: CurrentLACofEnergy,
    LACconstant: ConstantLACofEnergy,
  };

  const Output: OutputModGPO = {
    SensitivityAnalysis: SensitivityAnalysis,
    CombinedTaxRate: CombinedTaxRate,
    Financing: Financing,
    CurrentLAC: CurrentLevelAnnualCost,
    ConstantLAC: ConstantLevelAnnualCost,
    ElectricalAndFuelBaseYear: ElectricalFuelBaseYear,
    ExpensesBaseYear: ExpensesBaseYear,
    IncomeOtherThanEnergy: IncomeOtherThanEnergy,
    AnnualCashFlows: cashFlow,
    TotalCashFlow: Total,
  };

  return Output;
}

export { GenericPowerOnly };
