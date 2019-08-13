// GenericCombinedHeatPower
export interface GenericCombinedHeatPowerInputMod {
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
