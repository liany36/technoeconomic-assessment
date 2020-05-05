import { InputModGP } from './input.model';
import {
  CapitalCostMod,
  CashFlowGP,
  ConstantLevelAnnualCostMod,
  CurrentLevelAnnualCostMod,
  ElectricalFuelBaseYearModGP,
  ExpensesBaseYearModGP,
  FinancingMod,
  HeatBaseYearMod,
  IncomeOtherThanEnergyModGP,
  OutputModGP,
  SensitivityAnalysisMod,
  TotalCashFlowGP
} from './output.model';

function GasificationPower(input: InputModGP) {
  // Constants
  const HeavyDieselDensity = 850; // Heavy Diesel Density 298K, 1 atm (kg/m3)
  const HeavyDieselHHV = 45.5; // Heavy Diesel Higher Heating Value (MJ/kg)
  const CO_HHV = 10.1; // CO Higher Heating Value (MJ/kg)
  const CO_LHV = 10.1; // CO Lower Heating Value (MJ/kg)
  const H2_HHV = 142; // H2 Higher Heating Value (MJ/kg)
  const H2_LHV = 120; // H2 Lower Heating Value (MJ/kg)
  const CH4_HHV = 55.5; // CH4 Higher Heating Value (MJ/kg)
  const CH4_LHV = 50; // CH4 Lower Heating Value (MJ/kg)
  // Fuel Properties
  const CODensity = (101325 * 28) / 8314 / 298; // CO Density 298K, 1 atm (kg/m3)
  const H2Density = (101325 * 2) / 8314 / 298; // H2 Diesel Density 298K, 1 atm (kg/m3)
  const CH4Density = (101325 * 16) / 8314 / 298; // CH4 Diesel Density 298K, 1 atm (kg/m3)
  const HeavyDieselHHVkJL = HeavyDieselHHV * HeavyDieselDensity; // Heavy Diesel Higher Heating Value (kJ/L)
  const CO_HHV_KJL = CO_HHV * CODensity * 1000; // CO Higher Heating Value (kJ/L)
  const CO_LHV_KJL = CO_LHV * CODensity * 1000; // CO Lower Heating Value (kJ/L)
  const H2_HHV_KJL = H2_HHV * H2Density * 1000; // H2 Higher Heating Value (kJ/L)
  const H2_LHV_KJL = H2_LHV * H2Density * 1000; // H2 Lower Heating Value (kJ/L)
  const CH4_HHV_KJL = CH4_HHV * CH4Density * 1000; // CH4 Higher Heating Value (kJ/L)
  const CH4_LHV_KJL = CH4_LHV * CH4Density * 1000; // CH4 Lower Heating Value (kJ/L)
  // Capital Cost
  const CapitalCost: CapitalCostMod = {
    TotalFacilityCapitalCost: 0,
    GasifierSystemCapitalCostPerKwe: 0,
    GasCleaningSystemCapitalCostPerKwe: 0,
    PowerGenerationCapitalCostPerKwe: 0,
    EmissionControlSystemCapitalCostPerKwe: 0,
    HeatRecoverySystemCapitalCostPerKwe: 0,
    TotalFacilityCapitalCostPerKwe: 0
  };
  CapitalCost.GasifierSystemCapitalCostPerKwe =
    input.CapitalCost.GasifierSystemCapitalCost /
    input.ElectricalFuelBaseYear.NetElectricalCapacity;
  CapitalCost.GasCleaningSystemCapitalCostPerKwe =
    input.CapitalCost.GasCleaningSystemCapitalCost /
    input.ElectricalFuelBaseYear.NetElectricalCapacity;
  CapitalCost.PowerGenerationCapitalCostPerKwe =
    input.CapitalCost.PowerGenerationCapitalCost /
    input.ElectricalFuelBaseYear.NetElectricalCapacity;
  CapitalCost.EmissionControlSystemCapitalCostPerKwe =
    input.CapitalCost.EmissionControlSystemCapitalCost /
    input.ElectricalFuelBaseYear.NetElectricalCapacity;
  CapitalCost.HeatRecoverySystemCapitalCostPerKwe =
    input.CapitalCost.HeatRecoverySystemCapitalCost /
    input.ElectricalFuelBaseYear.NetElectricalCapacity;
  CapitalCost.TotalFacilityCapitalCost =
    input.CapitalCost.GasifierSystemCapitalCost +
    input.CapitalCost.GasCleaningSystemCapitalCost +
    input.CapitalCost.PowerGenerationCapitalCost +
    input.CapitalCost.EmissionControlSystemCapitalCost +
    input.CapitalCost.HeatRecoverySystemCapitalCost;
  CapitalCost.TotalFacilityCapitalCostPerKwe =
    CapitalCost.TotalFacilityCapitalCost /
    input.ElectricalFuelBaseYear.NetElectricalCapacity;
  // Electrical and Fuel--base year
  const ParasiticLoad =
    input.ElectricalFuelBaseYear.GrossElectricalCapacity -
    input.ElectricalFuelBaseYear.NetElectricalCapacity;
  const AnnualHours =
    (input.ElectricalFuelBaseYear.CapacityFactor / 100) * 8760;
  const AnnualNetElectricityGeneration =
    input.ElectricalFuelBaseYear.NetElectricalCapacity * AnnualHours;
  const OverallNetSystemEfficiency =
    (input.ElectricalFuelBaseYear.HHVEfficiency *
      input.ElectricalFuelBaseYear.NetHHVEfficiency) /
    100;
  const N2 =
    100 -
    (input.ElectricalFuelBaseYear.CO +
      input.ElectricalFuelBaseYear.H2 +
      input.ElectricalFuelBaseYear.Hydrocarbons +
      input.ElectricalFuelBaseYear.CO2 +
      input.ElectricalFuelBaseYear.O2);
  const CleanGasMolecularMass =
    (input.ElectricalFuelBaseYear.CO * 28 +
      input.ElectricalFuelBaseYear.H2 * 2 +
      input.ElectricalFuelBaseYear.Hydrocarbons * 16 +
      input.ElectricalFuelBaseYear.CO2 * 44 +
      input.ElectricalFuelBaseYear.O2 * 32 +
      N2 * 28) /
    100;
  const CleanGasDensity = (101325 * CleanGasMolecularMass) / 8314 / 298;
  const CleanGasHHeating =
    (input.ElectricalFuelBaseYear.CO * CO_HHV_KJL +
      input.ElectricalFuelBaseYear.H2 * H2_HHV_KJL +
      input.ElectricalFuelBaseYear.Hydrocarbons * CH4_HHV_KJL) /
    100;
  const CleanGasLHeating =
    (input.ElectricalFuelBaseYear.CO * CO_LHV_KJL +
      input.ElectricalFuelBaseYear.H2 * H2_LHV_KJL +
      input.ElectricalFuelBaseYear.Hydrocarbons * CH4_LHV_KJL) /
    100;
  const TotalFuelPowerInput =
    input.ElectricalFuelBaseYear.NetElectricalCapacity /
    (input.ElectricalFuelBaseYear.NetHHVEfficiency / 100);
  const CleanGasPowerInput =
    TotalFuelPowerInput *
    (1 - input.ElectricalFuelBaseYear.FractionOfInputEnergy / 100);
  const DualFuelPowerInput =
    (TotalFuelPowerInput * input.ElectricalFuelBaseYear.FractionOfInputEnergy) /
    100;
  const CleanGasFlowRateVolume = (CleanGasPowerInput / CleanGasHHeating) * 3600;
  const CleanGasFlowRateMass = CleanGasFlowRateVolume * CleanGasDensity;
  const AnnualCleanGasConsumption = (CleanGasFlowRateMass * AnnualHours) / 1000;
  const DualFuelFlowRate = (DualFuelPowerInput / HeavyDieselHHVkJL) * 3600;
  const AnnualDualFuelConsumption = DualFuelFlowRate * AnnualHours;
  input.ElectricalFuelBaseYear.HHV =
    input.ElectricalFuelBaseYear.HHV *
    (1 - input.ElectricalFuelBaseYear.MoistureContent / 100);
  const BiomassFeedRate =
    (CleanGasPowerInput /
      (input.ElectricalFuelBaseYear.HHVEfficiency / 100) /
      input.ElectricalFuelBaseYear.HHV) *
    3600;
  const AnnualBiomassConsumptionDry = (BiomassFeedRate * AnnualHours) / 1000;
  const AnnualBiomassConsumptionWet =
    AnnualBiomassConsumptionDry /
    (1 - input.ElectricalFuelBaseYear.MoistureContent / 100);
  const CharProductionRate =
    ((input.ElectricalFuelBaseYear.AshContent / 100) * BiomassFeedRate) /
    (1 - input.ElectricalFuelBaseYear.CarbonConcentration / 100);
  const AnnualCharProduction = (CharProductionRate * AnnualHours) / 1000;
  // Heat--base year
  const TotalHeatProductionRate =
    TotalFuelPowerInput - input.ElectricalFuelBaseYear.GrossElectricalCapacity;
  const RecoveredHeat =
    (TotalHeatProductionRate *
      input.HeatBaseYear.AggregateFractionOfHeatRecovered) /
    100;
  const AnnualHeatSales = RecoveredHeat * AnnualHours;
  const TotalIncomeFromHeatSales =
    AnnualHeatSales * input.HeatBaseYear.AggregateSalesPriceForHeat;
  const HeatIncomePerUnitNEE =
    TotalIncomeFromHeatSales / AnnualNetElectricityGeneration;
  const OverallCHPefficiencyGross =
    ((input.ElectricalFuelBaseYear.GrossElectricalCapacity * AnnualHours +
      AnnualHeatSales) /
      (TotalFuelPowerInput * AnnualHours)) *
    100;
  const OverallCHPefficiencyNet =
    ((AnnualNetElectricityGeneration + AnnualHeatSales) /
      (TotalFuelPowerInput * AnnualHours)) *
    100;
  // Expenses--base year
  const BiomassFuelCostPerKwh =
    (AnnualBiomassConsumptionDry * input.ExpensesBaseYear.BiomassFuelCost) /
    AnnualNetElectricityGeneration;
  const DualFuelPerKwh =
    (input.ExpensesBaseYear.DualFuelCost * AnnualDualFuelConsumption) /
    AnnualNetElectricityGeneration;
  const LaborCostKwh =
    input.ExpensesBaseYear.LaborCost / AnnualNetElectricityGeneration;
  const MaintenanceCostKwh =
    input.ExpensesBaseYear.MaintenanceCost / AnnualNetElectricityGeneration;
  const WasteTreatmentKwh =
    input.ExpensesBaseYear.WasteTreatment / AnnualNetElectricityGeneration;
  const InsurancePropertyTaxKwh =
    input.ExpensesBaseYear.InsurancePropertyTax /
    AnnualNetElectricityGeneration;
  const UtilitiesKwh =
    input.ExpensesBaseYear.Utilities / AnnualNetElectricityGeneration;
  const ManagementKwh =
    input.ExpensesBaseYear.Management / AnnualNetElectricityGeneration;
  const OtherOperatingExpensesKwh =
    input.ExpensesBaseYear.OtherOperatingExpenses /
    AnnualNetElectricityGeneration;
  const TotalNonFuelExpenses =
    input.ExpensesBaseYear.LaborCost +
    input.ExpensesBaseYear.MaintenanceCost +
    input.ExpensesBaseYear.WasteTreatment +
    input.ExpensesBaseYear.InsurancePropertyTax +
    input.ExpensesBaseYear.Utilities +
    input.ExpensesBaseYear.Management +
    input.ExpensesBaseYear.OtherOperatingExpenses;
  const TotalNonFuelExpensesKwh =
    LaborCostKwh +
    MaintenanceCostKwh +
    WasteTreatmentKwh +
    InsurancePropertyTaxKwh +
    UtilitiesKwh +
    ManagementKwh +
    OtherOperatingExpensesKwh;
  const TotalExpensesIncludingFuel =
    input.ExpensesBaseYear.BiomassFuelCost * AnnualBiomassConsumptionDry +
    input.ExpensesBaseYear.DualFuelCost * AnnualDualFuelConsumption +
    TotalNonFuelExpenses;
  const TotalExpensesIncludingFuelKwh =
    BiomassFuelCostPerKwh + DualFuelPerKwh + TotalNonFuelExpensesKwh;
  // Taxes
  const CombinedTaxRate =
    input.Taxes.StateTaxRate +
    input.Taxes.FederalTaxRate * (1 - input.Taxes.StateTaxRate / 100);
  // Financing
  const EquityRatio = 100 - input.Financing.DebtRatio;
  const CostOfMoney =
    (input.Financing.DebtRatio / 100) * input.Financing.InterestRateOnDebt +
    (EquityRatio / 100) * input.Financing.CostOfEquity;
  const TotalCostOfPlant = CapitalCost.TotalFacilityCapitalCost;
  const TotalEquityCost = (TotalCostOfPlant * EquityRatio) / 100;
  const TotalDebtCost = (TotalCostOfPlant * input.Financing.DebtRatio) / 100;
  const CapitalRecoveryFactorEquity =
    ((input.Financing.CostOfEquity / 100) *
      (1 + input.Financing.CostOfEquity / 100) **
        input.Financing.EconomicLife) /
    ((1 + input.Financing.CostOfEquity / 100) ** input.Financing.EconomicLife -
      1);
  const CapitalRecoveryFactorDebt =
    ((input.Financing.InterestRateOnDebt / 100) *
      (1 + input.Financing.InterestRateOnDebt / 100) **
        input.Financing.EconomicLife) /
    ((1 + input.Financing.InterestRateOnDebt / 100) **
      input.Financing.EconomicLife -
      1);
  const AnnualEquityRecovery = CapitalRecoveryFactorEquity * TotalEquityCost;
  const AnnualDebtPayment = TotalDebtCost * CapitalRecoveryFactorDebt;
  const DebtReserve = AnnualDebtPayment;
  // Income other than energy
  const AnnualCapacityPayment =
    input.IncomeOtherThanEnergy.CapacityPayment *
    input.ElectricalFuelBaseYear.NetElectricalCapacity;
  const AnnualDebtReserveInterest =
    (DebtReserve * input.IncomeOtherThanEnergy.InterestRateOnDebtReserve) / 100;
  const AnnualIncomeFromChar =
    input.IncomeOtherThanEnergy.SalesPriceForChar * AnnualCharProduction;
  // Depreciation Schedule
  const DepreciationFraction = 1 / input.Financing.EconomicLife;
  // Annual Cash Flows
  const cashFlow = [];
  for (let i = 0; i < input.Financing.EconomicLife; i++) {
    const newCF: CashFlowGP = {
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
      BiomassFuelCost: 0,
      DualFuelCost: 0,
      IncomeHeat: 0,
      IncomeChar: 0
    };
    cashFlow.push(newCF);
  }
  for (let i = 0; i < input.Financing.EconomicLife; i++) {
    cashFlow[i] = CalcCashFlow(cashFlow[i - 1], i + 1);
  }
  function CalcCashFlow(CF: CashFlowGP, Year: number) {
    const newCF: CashFlowGP = {
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
      BiomassFuelCost: 0,
      DualFuelCost: 0,
      IncomeHeat: 0,
      IncomeChar: 0
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
      newCF.BiomassFuelCost =
        AnnualBiomassConsumptionDry * input.ExpensesBaseYear.BiomassFuelCost;
      newCF.DualFuelCost =
        AnnualDualFuelConsumption * input.ExpensesBaseYear.DualFuelCost;
    } else {
      newCF.DebtPrincipalRemaining =
        CF.DebtPrincipalRemaining - newCF.DebtPrincipalPaid;
      newCF.BiomassFuelCost =
        CF.BiomassFuelCost * (1 + input.EscalationBiomassFuel / 100);
      newCF.DualFuelCost =
        CF.DualFuelCost * (1 + input.EscalationDualFuel / 100);
    }
    newCF.NonFuelExpenses =
      TotalNonFuelExpenses *
      Math.pow(1 + input.EscalationOther / 100, Year - 1);
    if (Year === 1) {
      newCF.DebtReserve = DebtReserve;
    } else if (Year < input.Financing.EconomicLife) {
      newCF.DebtReserve = 0;
    } else {
      newCF.DebtReserve = -DebtReserve;
    }
    newCF.Depreciation = TotalCostOfPlant * DepreciationFraction;
    newCF.IncomeCapacity = AnnualCapacityPayment;
    if (Year === 1) {
      newCF.IncomeHeat = TotalIncomeFromHeatSales;
      newCF.IncomeChar = AnnualIncomeFromChar;
    } else {
      newCF.IncomeHeat =
        TotalIncomeFromHeatSales *
        Math.pow(1 + input.EscalationHeatSales / 100, Year - 1);
      newCF.IncomeChar = CF.IncomeChar * (1 + input.EscalationCharSales / 100);
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
      AnnualNetElectricityGeneration *
      input.Taxes.ProductionTaxCredit *
      Math.pow(1 + input.EscalationProductionTaxCredit / 100, Year - 1) *
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
      newCF.BiomassFuelCost +
      newCF.DualFuelCost +
      newCF.NonFuelExpenses +
      newCF.Taxes +
      newCF.DebtReserve -
      newCF.IncomeCapacity -
      newCF.InterestOnDebtReserve -
      newCF.IncomeHeat -
      newCF.IncomeChar;
    return newCF;
  }
  const Total: TotalCashFlowGP = {
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
    BiomassFuelCost: 0,
    DualFuelCost: 0,
    IncomeHeat: 0,
    IncomeChar: 0
  };
  for (let i = 0; i < cashFlow.length; i++) {
    Total.EquityRecovery += cashFlow[i].EquityRecovery;
    Total.EquityInterest += cashFlow[i].EquityInterest;
    Total.EquityPrincipalPaid += cashFlow[i].EquityPrincipalPaid;
    Total.DebtRecovery += cashFlow[i].DebtRecovery;
    Total.DebtInterest += cashFlow[i].DebtInterest;
    Total.DebtPrincipalPaid += cashFlow[i].DebtPrincipalPaid;
    Total.BiomassFuelCost += cashFlow[i].BiomassFuelCost;
    Total.DualFuelCost += cashFlow[i].DualFuelCost;
    Total.NonFuelExpenses += cashFlow[i].NonFuelExpenses;
    Total.DebtReserve += cashFlow[i].DebtReserve;
    Total.Depreciation += cashFlow[i].Depreciation;
    Total.IncomeCapacity += cashFlow[i].IncomeCapacity;
    Total.IncomeHeat += cashFlow[i].IncomeHeat;
    Total.IncomeChar += cashFlow[i].IncomeChar;
    Total.InterestOnDebtReserve += cashFlow[i].InterestOnDebtReserve;
    Total.TaxesWoCredit += cashFlow[i].TaxesWoCredit;
    Total.TaxCredit += cashFlow[i].TaxCredit;
    Total.Taxes += cashFlow[i].Taxes;
    Total.EnergyRevenueRequired += cashFlow[i].EnergyRevenueRequired;
  }
  // Current $ Level Annual Cost (LAC)
  const CurrentLevelAnnualCost: CurrentLevelAnnualCostMod = {
    CostOfMoney: 0,
    PresentWorth: [],
    TotalPresentWorth: 0,
    CapitalRecoveryFactorCurrent: 0,
    CurrentLevelAnnualRevenueRequirements: 0,
    CurrentLACofEnergy: 0
  };
  CurrentLevelAnnualCost.CostOfMoney = input.Financing.CostOfEquity / 100;
  let TempPresentWorth: number;
  for (let i = 0; i < input.Financing.EconomicLife; i++) {
    TempPresentWorth =
      cashFlow[i].EnergyRevenueRequired *
      (1 + CurrentLevelAnnualCost.CostOfMoney) ** -cashFlow[i].Year;
    CurrentLevelAnnualCost.TotalPresentWorth += TempPresentWorth;
    CurrentLevelAnnualCost.PresentWorth.push(TempPresentWorth);
  }
  CurrentLevelAnnualCost.CapitalRecoveryFactorCurrent =
    (CurrentLevelAnnualCost.CostOfMoney *
      (1 + CurrentLevelAnnualCost.CostOfMoney) **
        input.Financing.EconomicLife) /
    ((1 + CurrentLevelAnnualCost.CostOfMoney) ** input.Financing.EconomicLife -
      1);
  CurrentLevelAnnualCost.CurrentLevelAnnualRevenueRequirements =
    CurrentLevelAnnualCost.TotalPresentWorth *
    CurrentLevelAnnualCost.CapitalRecoveryFactorCurrent;
  CurrentLevelAnnualCost.CurrentLACofEnergy =
    CurrentLevelAnnualCost.CurrentLevelAnnualRevenueRequirements /
    AnnualNetElectricityGeneration;
  // Constant & Level Annual Cost (LAC)
  const ConstantLevelAnnualCost: ConstantLevelAnnualCostMod = {
    RealCostOfMoney: 0,
    CapitalRecoveryFactorConstant: 0,
    ConstantLevelAnnualRevenueRequirements: 0,
    ConstantLACofEnergy: 0
  };
  ConstantLevelAnnualCost.RealCostOfMoney =
    (1 + CurrentLevelAnnualCost.CostOfMoney) /
      (1 + input.GeneralInflation / 100) -
    1;
  ConstantLevelAnnualCost.CapitalRecoveryFactorConstant =
    (ConstantLevelAnnualCost.RealCostOfMoney *
      (1 + ConstantLevelAnnualCost.RealCostOfMoney) **
        input.Financing.EconomicLife) /
    ((1 + ConstantLevelAnnualCost.RealCostOfMoney) **
      input.Financing.EconomicLife -
      1);
  ConstantLevelAnnualCost.ConstantLevelAnnualRevenueRequirements =
    CurrentLevelAnnualCost.TotalPresentWorth *
    ConstantLevelAnnualCost.CapitalRecoveryFactorConstant;
  ConstantLevelAnnualCost.ConstantLACofEnergy =
    ConstantLevelAnnualCost.ConstantLevelAnnualRevenueRequirements /
    AnnualNetElectricityGeneration;
  const ElectricalFuelBaseYear: ElectricalFuelBaseYearModGP = {
    ParasiticLoad: ParasiticLoad,
    AnnualHours: AnnualHours,
    AnnualNetElectricityGeneration: AnnualNetElectricityGeneration,
    OverallNetSystemEfficiency: OverallNetSystemEfficiency,
    NitrogenGas: N2,
    CleanGasMolecularMass: CleanGasMolecularMass,
    CleanGasDensity: CleanGasDensity,
    CleanGasHigherHeatingValue: CleanGasHHeating,
    CleanGasLowerHeatingValue: CleanGasLHeating,
    TotalFuelPowerInput: TotalFuelPowerInput,
    CleanGasPowerInput: CleanGasPowerInput,
    DualFuelPowerInput: DualFuelPowerInput,
    CleanGasFlowRateVolume: CleanGasFlowRateVolume,
    CleanGasFlowRateMass: CleanGasFlowRateMass,
    AnnualCleanGasConsumption: AnnualCleanGasConsumption,
    DualFuelFlowRate: DualFuelFlowRate,
    AnnualDualFuelConsumption: AnnualDualFuelConsumption,
    BiomassFeedRate: BiomassFeedRate,
    AnnualBiomassConsumptionDryMass: AnnualBiomassConsumptionDry,
    AnnualBiomassConsumptionWetMass: AnnualBiomassConsumptionWet,
    CharProductionRate: CharProductionRate,
    AnnualCharProduction: AnnualCharProduction
  };
  const HeatBaseYear: HeatBaseYearMod = {
    TotalHeatProductionRate: TotalHeatProductionRate,
    RecoveredHeat: RecoveredHeat,
    AnnualHeatSales: AnnualHeatSales,
    TotalIncomeFromHeatSales: TotalIncomeFromHeatSales,
    HeatIncomePerUnitNEE: HeatIncomePerUnitNEE,
    OverallCHPefficiencyGross: OverallCHPefficiencyGross,
    OverallCHPefficiencyNet: OverallCHPefficiencyNet
  };
  const ExpensesBaseYear: ExpensesBaseYearModGP = {
    TotalNonFuelExpenses: TotalNonFuelExpenses,
    TotalExpensesIncludingFuel: TotalExpensesIncludingFuel,
    LaborCostKwh: LaborCostKwh,
    MaintenanceCostKwh: MaintenanceCostKwh,
    InsurancePropertyTaxKwh: InsurancePropertyTaxKwh,
    UtilitiesKwh: UtilitiesKwh,
    ManagementKwh: ManagementKwh,
    OtherOperatingExpensesKwh: OtherOperatingExpensesKwh,
    TotalNonFuelExpensesKwh: TotalNonFuelExpensesKwh,
    TotalExpensesIncludingFuelKwh: TotalExpensesIncludingFuelKwh,
    BiomassFuelCostKwh: BiomassFuelCostPerKwh,
    DualFuelCostKwh: DualFuelPerKwh,
    WasteTreatmentKwh: WasteTreatmentKwh
  };
  const IncomeOtherThanEnergy: IncomeOtherThanEnergyModGP = {
    AnnualCapacityPayment: 0,
    AnnualDebtReserveInterest: 0,
    AnnualIncomeFromChar: 0
  };
  IncomeOtherThanEnergy.AnnualCapacityPayment = AnnualCapacityPayment;
  IncomeOtherThanEnergy.AnnualDebtReserveInterest = AnnualDebtReserveInterest;
  IncomeOtherThanEnergy.AnnualIncomeFromChar = AnnualIncomeFromChar;
  const Financing: FinancingMod = {
    EquityRatio: EquityRatio,
    CostOfMoney: CostOfMoney,
    TotalCostOfPlant: TotalCostOfPlant,
    TotalEquityCost: TotalEquityCost,
    TotalDebtCost: TotalDebtCost,
    CapitalRecoveryFactorEquity: CapitalRecoveryFactorEquity,
    CapitalRecoveryFactorDebt: CapitalRecoveryFactorDebt,
    AnnualEquityRecovery: AnnualEquityRecovery,
    AnnualDebtPayment: AnnualDebtPayment,
    DebtReserve: DebtReserve
  };
  const SensitivityAnalysis: SensitivityAnalysisMod = {
    LACcurrent: CurrentLevelAnnualCost.CurrentLACofEnergy,
    LACconstant: ConstantLevelAnnualCost.ConstantLACofEnergy
  };

  const Output: OutputModGP = {
    SensitivityAnalysis: SensitivityAnalysis,
    CombinedTaxRate: CombinedTaxRate,
    Financing: Financing,
    CurrentLAC: CurrentLevelAnnualCost,
    ConstantLAC: ConstantLevelAnnualCost,
    CapitalCost: CapitalCost,
    ElectricalAndFuelBaseYear: ElectricalFuelBaseYear,
    HeatBaseYear: HeatBaseYear,
    ExpensesBaseYear: ExpensesBaseYear,
    IncomeOtherThanEnergy: IncomeOtherThanEnergy,
    AnnualCashFlows: cashFlow,
    TotalCashFlow: Total
  };

  return Output;
}
export { GasificationPower };
