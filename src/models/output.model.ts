export interface ElectricalFuelBaseYearMod {
  AnnualHours: number;
  BiomassTarget: number;
}

export interface ElectricalFuelBaseYearModGPO extends ElectricalFuelBaseYearMod {
  // Shared // generica-power-only
  FuelConsumptionRate: number;
  AnnualGeneration: number;
  CapitalCostNEC: number;
  AnnualFuelConsumption: number;
  AnnualAshDisposal: number;
}

export interface ElectricalFuelBaseYearModCHP
  extends ElectricalFuelBaseYearModGPO {
  // combined-heat-power
  ParasiticLoad: number;
  FuelPower: number;
  GrossStationElectricalEfficiency: number;
}

export interface ElectricalFuelBaseYearModGP extends ElectricalFuelBaseYearMod {
  // gasification-power
  ParasiticLoad: number;
  AnnualNetElectricityGeneration: number;
  OverallNetSystemEfficiency: number;
  NitrogenGas: number;
  CleanGasMolecularMass: number;
  CleanGasDensity: number;
  CleanGasHigherHeatingValue: number;
  CleanGasLowerHeatingValue: number;
  TotalFuelPowerInput: number;
  CleanGasPowerInput: number;
  DualFuelPowerInput: number;
  CleanGasFlowRateVolume: number;
  CleanGasFlowRateMass: number;
  AnnualCleanGasConsumption: number;
  DualFuelFlowRate: number;
  AnnualDualFuelConsumption: number;
  BiomassFeedRate: number;
  AnnualBiomassConsumptionDryMass: number;
  AnnualBiomassConsumptionWetMass: number;
  CharProductionRate: number;
  AnnualCharProduction: number;
}

export interface HeatBaseYearMod {
  TotalHeatProductionRate: number;
  RecoveredHeat: number;
  AnnualHeatSales: number;
  TotalIncomeFromHeatSales: number;
  HeatIncomePerUnitNEE: number;
  OverallCHPefficiencyGross: number;
  OverallCHPefficiencyNet: number;
}

export interface ExpensesBaseYearMod {
  // Shared
  TotalNonFuelExpenses: number;
  TotalExpensesIncludingFuel: number;
  LaborCostKwh: number;
  MaintenanceCostKwh: number;
  InsurancePropertyTaxKwh: number;
  UtilitiesKwh: number;
  ManagementKwh: number;
  OtherOperatingExpensesKwh: number;
  TotalNonFuelExpensesKwh: number;
  TotalExpensesIncludingFuelKwh: number;
}

export interface ExpensesBaseYearModGPO extends ExpensesBaseYearMod {
  // generic-power-only & combined-heat-power
  FuelCostKwh: number;
  AshDisposalKwh: number;
}

export interface ExpensesBaseYearModGP extends ExpensesBaseYearMod {
  // gasification-power
  BiomassFuelCostKwh: number;
  DualFuelCostKwh: number;
  WasteTreatmentKwh: number;
}

export interface ExpensesBaseYearModHydrogen {
  // hydrogen
  AnnualFeedstockCost: number;
  OperatingExpenses: number;
  TotalAnnualExpenses: number;
}

export interface IncomeOtherThanEnergyMod {
  // Shared
  AnnualCapacityPayment: number;
  AnnualDebtReserveInterest: number;
}

export interface IncomeOtherThanEnergyModGP extends IncomeOtherThanEnergyMod {
  // gasification-power
  AnnualIncomeFromChar: number;
}

export interface FinancingMod {
  // Shared // All
  EquityRatio: number;
  CostOfMoney: number;
  TotalCostOfPlant: number;
  TotalEquityCost: number;
  TotalDebtCost: number;
  CapitalRecoveryFactorEquity: number;
  CapitalRecoveryFactorDebt: number;
  AnnualEquityRecovery: number;
  AnnualDebtPayment: number;
  DebtReserve: number;
}

export interface CurrentLevelAnnualCostMod {
  // Shared // All
  CostOfMoney: number;
  PresentWorth: number[];
  TotalPresentWorth: number;
  CapitalRecoveryFactorCurrent: number;
  CurrentLevelAnnualRevenueRequirements: number;
  CurrentLACofEnergy: number;
}

export interface ConstantLevelAnnualCostMod {
  // Shared // All
  RealCostOfMoney: number;
  CapitalRecoveryFactorConstant: number;
  ConstantLevelAnnualRevenueRequirements: number;
  ConstantLACofEnergy: number;
}

export interface SensyAnalysisMod {
  // Shared // All
  LACcurrent: number;
  LACconstant: number;
}

// Annual Cash Flows - Shared
export interface CashFlow {
  Year: number;
  EquityRecovery: number;
  EquityInterest: number;
  EquityPrincipalPaid: number;
  EquityPrincipalRemaining: number;
  DebtRecovery: number;
  DebtInterest: number;
  DebtPrincipalPaid: number;
  DebtPrincipalRemaining: number;
  // FuelCost: number;
  NonFuelExpenses: number;
  DebtReserve: number;
  Depreciation: number;
  IncomeCapacity: number;
  InterestOnDebtReserve: number;
  TaxesWoCredit: number;
  TaxCredit: number;
  Taxes: number;
  EnergyRevenueRequired: number;
}

export interface CashFlowGPO extends CashFlow {
  // generic-power-only
  FuelCost: number;
}

export interface CashFlowCHP extends CashFlow {
  // combined-heat-power
  FuelCost: number;
  IncomeHeat: number;
}

export interface CashFlowGP extends CashFlow {
  // gasification-power
  BiomassFuelCost: number;
  DualFuelCost: number;
  IncomeHeat: number;
  IncomeChar: number;
}

export interface CashFlowHydrogen extends CashFlow {
  // hydrogen
  FuelCost: number;
  Expenses: number;
  IncomeElectricalEnergy: number;
  IncomeIncentivePayments: number;
  IncomeHeat: number;
  IncomeResidue: number;
}

// Total Cash Flow - Shared
export interface TotalCashFlow {
  EquityRecovery: number;
  EquityInterest: number;
  EquityPrincipalPaid: number;
  DebtRecovery: number;
  DebtInterest: number;
  DebtPrincipalPaid: number;
  // FuelCost: number;
  NonFuelExpenses: number;
  DebtReserve: number;
  Depreciation: number;
  IncomeCapacity: number;
  InterestOnDebtReserve: number;
  TaxesWoCredit: number;
  TaxCredit: number;
  Taxes: number;
  EnergyRevenueRequired: number;
}

export interface TotalCashFlowGPO extends TotalCashFlow {
  // generic-power-only
  FuelCost: number;
}

export interface TotalCashFlowCHP extends TotalCashFlow {
  // combined-heat-power
  FuelCost: number;
  IncomeHeat: number;
}

export interface TotalCashFlowGP extends TotalCashFlow {
  // gasification-power
  BiomassFuelCost: number;
  DualFuelCost: number;
  IncomeHeat: number;
  IncomeChar: number;
}

export interface TotalCashFlowHydrogen extends TotalCashFlow {
  // hydrogen
  FuelCost: number;
  Expenses: number;
  IncomeElectricalEnergy: number;
  IncomeIncentivePayments: number;
  IncomeHeat: number;
  IncomeResidue: number;
}

export interface SensitivityAnalysisMod {
  LACcurrent: number;
  LACconstant: number;
}

export interface CapitalCostMod {
  // combined-heat-power
  TotalFacilityCapitalCost: number;
  GasifierSystemCapitalCostPerKwe: number;
  GasCleaningSystemCapitalCostPerKwe: number;
  PowerGenerationCapitalCostPerKwe: number;
  EmissionControlSystemCapitalCostPerKwe: number;
  HeatRecoverySystemCapitalCostPerKwe: number;
  TotalFacilityCapitalCostPerKwe: number;
}

export interface HydrogenGenerationMod {
  HydrogenEnergy: number;
  DesignHydrogenProductionRateMW: number;
  DesignHydrogenProductionRateMg: number;
  FeedstockInput: number;
  FeedstockSupply: number;
  AnnualHours: number;
  AnnualFeedstockSupply: number;
  AnnualFeedstockEnergyInput: number;
  AnnualHydrogenProductionMg: number;
  AnnualHydrogenProductionKg: number;
  AnnualHydrogenEnergy: number;
}

export interface OutputMod {
  SensitivityAnalysis: SensitivityAnalysisMod;
  CombinedTaxRate: number;
  Financing: FinancingMod;
  CurrentLAC: CurrentLevelAnnualCostMod;
  ConstantLAC: ConstantLevelAnnualCostMod;
}
export interface OutputModGPO extends OutputMod {
  ElectricalAndFuelBaseYear: ElectricalFuelBaseYearMod;
  ExpensesBaseYear: ExpensesBaseYearModGPO;
  IncomeOtherThanEnergy: IncomeOtherThanEnergyMod;
  AnnualCashFlows: CashFlowGPO[];
  TotalCashFlow: TotalCashFlowGPO;
}
export interface OutputModCHP extends OutputMod {
  ElectricalAndFuelBaseYear: ElectricalFuelBaseYearModCHP;
  HeatBaseYear: HeatBaseYearMod;
  ExpensesBaseYear: ExpensesBaseYearModGPO;
  IncomeOtherThanEnergy: IncomeOtherThanEnergyMod;
  AnnualCashFlows: CashFlowCHP[];
  TotalCashFlow: TotalCashFlowCHP;
}
export interface OutputModGP extends OutputMod {
  CapitalCost: CapitalCostMod;
  ElectricalAndFuelBaseYear: ElectricalFuelBaseYearModGP;
  HeatBaseYear: HeatBaseYearMod;
  ExpensesBaseYear: ExpensesBaseYearModGP;
  IncomeOtherThanEnergy: IncomeOtherThanEnergyModGP;
  AnnualCashFlows: CashFlowGP[];
  TotalCashFlow: TotalCashFlowGP;
}
export interface OutputModHydrogen extends OutputMod {
  HydrogenGeneration: HydrogenGenerationMod;
  ExpensesBaseYear: ExpensesBaseYearModHydrogen;
  AnnualCashFlows: CashFlowHydrogen[];
  TotalCashFlow: TotalCashFlowHydrogen;
}
