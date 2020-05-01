// GenericPowerOnly
export interface InputModGPO
  extends ElectricalFuelBaseYearInputModGPO,
    ExpensesBaseYearInputModGPO,
    TaxesInputMod,
    FinancingInputMod {
  CapitalCost: number;
  // Electrical and Fuel--base year
  // Expenses--base year
  // Taxes
  // Financing
  // Income other than energy
  CapacityPayment: number;
  InterestRateOnDebtReserve: number;
  // Escalation/Inflation
  GeneralInflation: number;
  EscalationFuel: number;
  EscalationProductionTaxCredit: number;
  EscalationOther: number;
  // Tax Credit Schedule
  TaxCreditFrac: number[];
}

// GenericCombinedHeatPower
export interface InputModCHP
  extends ElectricalFuelBaseYearInputModCHP,
    ExpensesBaseYearInputModGPO,
    HeatBaseYearInputMod,
    TaxesInputMod,
    FinancingInputMod {
  CapitalCost: number;
  // Electrical and Fuel--base year
  // Heat-base year
  // Expenses--base year
  // Taxes
  // Financing
  // Income other than energy
  CapacityPayment: number;
  InterestRateOnDebtReserve: number;
  // Escalation/Inflation
  GeneralInflation: number;
  EscalationFuel: number;
  EscalationProductionTaxCredit: number;
  EscalationHeatSales: number;
  EscalationOther: number;
  // Tax Credit Schedule
  TaxCreditFrac: number[];
}

// GasificationPower
export interface InputModGP
  extends ElectricalFuelBaseYearInputModGP,
    ExpensesBaseYearInputModGP,
    HeatBaseYearInputMod,
    TaxesInputMod {
  // Capital Cost from Gasification Power Generation
  GasifierSystemCapitalCost: number;
  GasCleaningSystemCapitalCost: number;
  PowerGenerationCapitalCost: number;
  EmissionControlSystemCapitalCost: number;
  HeatRecoverySystemCapitalCost: number;
  // Electrical and Fuel -- base year from Gasification Power Generation
  // Heat--Base Year
  // Expenses--Base Year
  // Taxes
  // Income Other Than Energy
  CapacityPayment: number;
  InterestRateOnDebtReserve: number;
  SalesPriceForChar: number;
  // Escalation/Inflation
  GeneralInflation: number;
  EscalationBiomassFuel: number;
  EscalationDualFuel: number;
  EscalationProductionTaxCredit: number;
  EscalationHeatSales: number;
  EscalationCharSales: number;
  EscalationOther: number;
  // Financing
  DebtRatio: number;
  InterestRateOnDebt: number;
  EconomicLife: number;
  CostOfEquity: number;
  // Tax Rate Schedule
  TaxCreditFrac: number[];
}

// Hydrogen
export interface InputModHydrogen {
  // Hydrogen Generation
  GrossDesignHydrogenCapacity: number;
  Feedstock: number;
  OverallProductionEfficiency: number;
  CapacityFactor: number;
  // Capital Cost
  CapitalCost: number;
  // Expenses--base year
  FeedstockCost: number;
  OperatingExpensesRate: number;
  // Other Revenues or Cost Savings
  ElectricalEnergy: number;
  IncentivePayments: number;
  Capacity: number;
  Heat: number;
  Residues: number;
  // Taxes and Tax credit
  FederalTaxRate: number;
  StateTaxRate: number;
  ProductionTaxCredit: number;
  NegativeTaxesOffset: boolean;
  // Escalation/Inflation
  GeneralInflation: number;
  EscalationFeedstock: number;
  EscalationElectricalEnergy: number;
  EscalationIncentivePayments: number;
  EscalationCapacityPayment: number;
  EscalationProductionTaxCredit: number;
  EscalationHeatSales: number;
  EscalationResidueSales: number;
  EscalationOther: number;
  // Financing
  DebtRatio: number;
  InterestRateOnDebt: number;
  OneYearDebtReserveRequired: boolean;
  MARR: number;
  EconomicLife: number;
  InterestRateOnDebtReserve: number;
  // Tax Credit Schedule
  TaxCreditFrac: number[];
}

export interface ElectricalFuelBaseYearInputMod {
  NetElectricalCapacity: number;
  CapacityFactor: number;
  MoistureContent: number;
}

export interface ElectricalFuelBaseYearInputModGPO
  extends ElectricalFuelBaseYearInputMod {
  NetStationEfficiency: number;
  FuelHeatingValue: number;
  FuelAshConcentration: number;
}

export interface ElectricalFuelBaseYearInputModCHP
  extends ElectricalFuelBaseYearInputModGPO {
  GrossElectricalCapacity: number;
}

export interface ElectricalFuelBaseYearInputModGP
  extends ElectricalFuelBaseYearInputMod {
  GrossElectricalCapacity: number;
  HHVEfficiency: number;
  NetHHVEfficiency: number;
  FractionOfInputEnergy: number; // Dual Fuel if ant, default set to heavy disele
  CO: number;
  H2: number;
  Hydrocarbons: number;
  CO2: number;
  O2: number;
  HHV: number; // Higher Heating Value of Biomass Feedstock to Gasifier (kJ/kg)
  AshContent: number;
  CarbonConcentration: number;
}

export interface ExpensesBaseYearInputMod {
  BiomassFuelCost: number; // FuelCost for GPO and CHP on spreadsheet
  LaborCost: number;
  MaintenanceCost: number;
  InsurancePropertyTax: number;
  Utilities: number;
  Management: number;
  OtherOperatingExpenses: number;
}

export interface ExpensesBaseYearInputModGPO extends ExpensesBaseYearInputMod {
  AshDisposal: number;
}

export interface ExpensesBaseYearInputModGP extends ExpensesBaseYearInputMod {
  DualFuelCost: number;
  WasteTreatment: number;
}

export interface HeatBaseYearInputMod {
  AggregateFractionOfHeatRecovered: number;
  AggregateSalesPriceForHeat: number;
}

export interface TaxesInputMod {
  FederalTaxRate: number;
  StateTaxRate: number;
  ProductionTaxCredit: number;
}

export interface FinancingInputMod {
  DebtRatio: number;
  InterestRateOnDebt: number;
  EconomicLife: number;
  CostOfEquity: number;
}
