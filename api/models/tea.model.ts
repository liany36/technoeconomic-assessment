export interface InputVarMod {
    // Capital Cost from Generic Power Only
    CapitalCost: number;
    // Capital Cost from Gasification Power Generation
    GasifierSystemCapitalCost: number;
    GasCleaningSystemCapitalCost: number;
    PowerGenerationCapitalCost: number;
    EmissionControlSystemCapitalCost: number;
    HeatRecoverySystemCapitalCost: number;
    // Electrical and Fuel--base year from Generic Power Only
    NetPlantCapacity: number;
    CapacityFactor: number;
    NetStationEfficiency: number;
    FuelHeatingValue: number;
    FuelAshConcentration: number;
    // Electrical and Fuel -- base year from Gasification Power Generation
    GrossElectricalCapacity: number;
    NetElectricalCapacity: number;
    HHVEfficiencyOfGasificationSystem: number;
    NetHHVEfficiencyofPowerGeneration: number;
    FractionOfInputEnergy: number; // Dual Fuel if ant, default set to heavy disele
    CleanGasComposition: number;
    CO: number;
    HydrogenGas: number;
    Hydrocarbons: number;
    CarbonDioxide: number;
    Oxygen: number;
    HigherHeatingValue: number;
    MoistureContent: number;
    AshContent: number;
    CarbonConcentration: number;
        // CapacityFactor: Same variable from Generic Power Only
    // Expenses--base year
    FuelCost: number;
    LaborCost: number;
    MaintenanceCost: number;
    InsurancePropertyTax: number;
    Utilities: number;
    AshDisposal: number;
    Management: number;
    OtherOperatingExpenses: number;
    // Taxes
    FederalTaxRate: number;
    StateTaxRate: number;
    ProductionTaxCredit: number;
    // Financing
    DebtRatio: number;
    InterestRateOnDebt: number;
    EconomicLife: number;
    CostOfEquity: number;
    // Income other than energy
    CapacityPayment: number;
    InterestRateonDebtReserve: number;
    // Escalation/Inflation
    GeneralInflation: number;
    EscalationFuel: number;
    EscalationForProductionTaxCredit: number;
    EscalationOther: number;
    // Tax Credit Schedule
    TaxCreditFrac: number[];
    // Unit conversions from Gasification Power Generation
    BtuPerCubicFoot: number;
    BtuPerPound: number;
    MetricTonsPerHour: number;
    DollarPerMetricTons: number;
    CubicFootPerPonds: number;
    DollarPerMillionBtu: number;
    // Fuel Properties from Gasification Power Generation
    GasolineDensity: number;
    GasolineHigherHeatingValueMjPerKg: number;
    GasolineLowerHeatingValueMjPerKg: number;
    LightDieselDensity: number;
    LightDieselHigherHeatingValueMjPerKg: number;
    LightDieselLowerHeatingValueMjPerKg: number;
    HeavyDieselDensity: number;
    HeavyDieselHigherHeatingValueMjPerKg: number;
    HeavyDieselLowerHeatingValueMjPerKg: number;
    NaturalGasDensity: number;
    NaturalGasHigherHeatingValueMjPerKg: number;
    NaturalGasLowerHeatingValueMjPerKg: number;
    COHigherHeatingValueMjPerKg: number;
    COLowerHeatingValueMjPerKg: number;
    H2HigherHeatingValueMjPerKg: number;
    H2LowerHeatingValueMjPerKg: number;
    CH4HigherHeatingValueMjPerKg: number;
    CH4LowerHeatingValueMjPerKg: number;
}
// Annual Cash Flows
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
    FuelCost: number;
    NonFuelExpenses: number;
    DebtReserve: number;
    Depreciation: number;
    CapacityIncome: number;
    InterestOnDebtReserve: number;
    TaxesWoCredit: number;
    TaxCredit: number;
    Taxes: number;
    EnergyRevenueRequired: number;
}
// Total Cash Flow
export interface TotalCashFlow {
    EquityRecovery: number;
    EquityInterest: number;
    EquityPrincipalPaid: number;
    DebtRecovery: number;
    DebtInterest: number;
    DebtPrincipalPaid: number;
    FuelCost: number;
    NonFuelExpenses: number;
    DebtReserve: number;
    Depreciation: number;
    CapacityIncome: number;
    InterestOnDebtReserve: number;
    TaxesWoCredit: number;
    TaxCredit: number;
    Taxes: number;
    EnergyRevenueRequired: number;
}
