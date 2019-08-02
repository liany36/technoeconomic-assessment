// GasificationPowerInputMod
export interface GasificationPowerInputMod {
    model: string;
    // Fuel Properties
    GasolineDensity: number;
    GasolineHigherHeatingMjPerKg: number;
    GasolineLowerHeatingMjPerKg: number;
    LightDieselDensity: number;
    LightDieselHigherHeatingMjPerKg: number;
    LightDieselLowerHeatingMjPerKg: number;
    HeavyDieselDensity: number;
    HeavyDieselHigherHeatingMjPerKg: number;
    HeavyDieselLowerHeatingMjPerKg: number;
    NaturalGasDensity: number;
    NaturalGasHigherHeatingMjPerKg: number;
    NaturalGasLowerHeatingMjPerKg: number;
    COHigherHeatingMjPerKg: number;
    COLowerHeatingMjPerKg: number;
    H2HigherHeatingMjPerKg: number;
    H2LowerHeatingMjPerKg: number;
    CH4HigherHeatingMjPerKg: number;
    CH4LowerHeatingMjPerKg: number;
    // Capital Cost from Gasification Power Generation
    GasifierSystemCapitalCost: number;
    GasCleaningSystemCapitalCost: number;
    PowerGenerationCapitalCost: number;
    EmissionControlSystemCapitalCost: number;
    HeatRecoverySystemCapitalCost: number;
    // Electrical and Fuel -- base year from Gasification Power Generation
    GrossElectricalCapacity: number;
    NetElectricalCapacity: number;
    HHVEfficiency: number;
    NetHHVEfficiency: number;
    FractionOfInputEnergy: number; // Dual Fuel if ant, default set to heavy disele
    CleanGasComposition: number;
    CO: number;
    H2: number;
    Hydrocarbons: number;
    CO2: number;
    O2: number;
    HigherHeating: number;
    MoistureContent: number;
    AshContent: number;
    CarbonConcentration: number;
    CapacityFactor: number;
    // Heat--Base Year
    AggregateFractionOfHeatRecovered: number;
    AggregateSalesPriceForHeat: number;
    // Expenses--Base Year
    BiomassFuelCost: number;
    DualFuelCost: number;
    LaborCost: number;
    MaintenanceCost: number;
    WasteTreatment: number;
    Insurance: number;
    Utilities: number;
    Management: number;
    OtherOperatingExpenses: number;
    // Taxes
    FederalTaxRate: number;
    StateTaxRate: number;
    ProductionTaxCredit: number;
    // Income Other Than Energy
    ElectricityCapacityPayment: number;
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

// Annual Cash Flows - Gasification Power
export interface CashFlowGas {
    Year: number;
    EquityRecovery: number;
    EquityInterest: number;
    EquityPrincipalPaid: number;
    EquityPrincipalRemaining: number;
    DebtRecovery: number;
    DebtInterest: number;
    DebtPrincipalPaid: number;
    DebtPrincipalRemaining: number;
    BiomassFuelCostCF: number;
    DualFuelCostCF: number;
    NonFuelExpensesCF: number;
    DebtReserveCF: number;
    Depreciation: number;
    CapacityIncome: number;
    HeatIncome: number;
    CharIncome: number;
    InterstOnDebtReserve: number;
    TaxWithoutCredit: number;
    TaxCredit: number;
    Taxes: number;
    EnergyRevenueRequired: number;
}

// Total Cash Flow - Gasification Power
export interface TotalCashFlowGas {
    EquityRecovery: number;
    EquityInterest: number;
    EquityPrincipalPaid: number;
    DebtRecovery: number;
    DebtInterest: number;
    DebtPrincipalPaid: number;
    BiomassFuelCostCF: number;
    DualFuelCostCF: number;
    NonFuelExpensesCF: number;
    DebtReserveCF: number;
    Depreciation: number;
    CapacityIncome: number;
    HeatIncome: number;
    CharIncome: number;
    InterstOnDebtReserve: number;
    TaxWithoutCredit: number;
    TaxCredit: number;
    Taxes: number;
    EnergyRevenueRequired: number;
}

// Current LAC
export interface CurrentLAC {
    CostOfMoney: number;
    PresentWorth: number[];
    TotalPresentWorth: number;
    CurrentCapitalRecoveryFactor: number;
    CurrentAnnualRevenueRequirements: number;
    CurrentLACPerKwh: number;
}

// Constant LAC
export interface ConstantLAC {
    RealCostOfMoney: number;
    ConstantCapitalRecoveryFactor: number;
    ConstantLevelAnnualRevenue: number;
    ConstantLACPerKwh: number;
}
