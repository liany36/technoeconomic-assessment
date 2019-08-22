// GenericPowerOnly Input
export interface GenericPowerOnlyInputMod {
    CapitalCost: number;
    // Electrical and Fuel--base year
    NetElectricalCapacity: number;
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
    EscalationProductionTaxCredit: number;
    EscalationOther: number;
    // Tax Credit Schedule
    TaxCreditFrac: number[];
}
