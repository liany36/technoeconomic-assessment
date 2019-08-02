// Hydrogen Input
export interface HydrogenInputMod {
    model: string;
    // Hydrogen Generation
    GrossDesignHydrogenCapacity: number;
    HydrogenHHV: number;
    HydrogenLHV: number;
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

// Annual Cash Flows - hydrogen
export interface CashFlowHydrogen {
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
    Expenses: number;
    Depreciation: number;
    IncomeElectricalEnergy: number;
    IncomeIncentivePayments: number;
    IncomeCapacity: number;
    IncomeHeat: number;
    IncomeResidue: number;
    InterestOnDebtReserve: number;
    TaxesWoCredit: number;
    TaxCredit: number;
    Taxes: number;
    EnergyRevenueRequired: number;
}

// Total Cash Flow - Hydrogen
export interface TotalCashFlowHydrogen {
    EquityRecovery: number;
    EquityInterest: number;
    EquityPrincipalPaid: number;
    DebtRecovery: number;
    DebtInterest: number;
    DebtPrincipalPaid: number;
    FuelCost: number;
    NonFuelExpenses: number;
    DebtReserve: number;
    Expenses: number;
    Depreciation: number;
    IncomeElectricalEnergy: number;
    IncomeIncentivePayments: number;
    IncomeCapacity: number;
    IncomeHeat: number;
    IncomeResidue: number;
    InterestOnDebtReserve: number;
    TaxesWoCredit: number;
    TaxCredit: number;
    Taxes: number;
    EnergyRevenueRequired: number;
}
