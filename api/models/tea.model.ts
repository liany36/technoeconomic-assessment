export interface GenericPowerOnlyInputMod {
    model: string;
    CapitalCost: number;
    // Electrical and Fuel--base year
    NetPlantCapacity: number;
    CapacityFactor: number;
    NetStationEfficiency: number;
    FuelHeatingValue: number;
    FuelAshConcentration: number;
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
}

export interface GenericCombinedHeatPowerInputMod {
    model: string;
    CapitalCost: number;
    // Electrical and Fuel--base year
    GrossElectricalCapacity: number;
    NetElectricalCapacity: number;
    CapacityFactor: number;
    NetStationEfficiency: number;
    FuelHeatingValue: number;
    FuelAshConcentration: number;
    // Heat-base year
    AggregateFractionOfHeatRecovered: number;
    AggregateSalesPriceForHeat: number;
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
    EscalationHeatSales: number;
    EscalationOther: number;
    // Tax Credit Schedule
    TaxCreditFrac: number[];
}

export interface GasificationPowerInputMod {
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

export interface HydrogenInputMod {
    model: string;
    // Hydrogen Generation
    GrossDesignHydrogenCapacity: number;
    HydrogenHHV: number;
    HydrogenLHV: number;
    Feedstock: number;
    OverallProductionEfficiency: number;
    CapacityFactor: number;
}

// Annual Cash Flows - generic-power-only
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

// Annual Cash Flows - generic-combined-heat-power
export interface CashFlowCHP {
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
    HeatSalesIncome: number;
    InterestOnDebtReserve: number;
    TaxesWoCredit: number;
    TaxCredit: number;
    Taxes: number;
    EnergyRevenueRequired: number;
}

// Total Cash Flow - generic-power-only
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

// Total Cash Flow - generic-combined-heat-power
export interface TotalCashFlowCHP {
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
    HeatSalesIncome: number;
    InterestOnDebtReserve: number;
    TaxesWoCredit: number;
    TaxCredit: number;
    Taxes: number;
    EnergyRevenueRequired: number;
}
