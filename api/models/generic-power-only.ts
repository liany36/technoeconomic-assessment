import { CashFlow, InputVarMod } from './tea.model';

function GenericPowerOnly(input: InputVarMod) {
    // Electrical and Fuel--base year
    const AnnualHours = input.CapacityFactor / 100 * 8760;
    const FuelConsumptionRate = input.NetPlantCapacity / (input.NetStationEfficiency / 100) * 3600
        / input.FuelHeatingValue / 1000;
    const AnnualGeneration = input.NetPlantCapacity * 8760 * input.CapacityFactor / 100;
    const CapitalCostNEC = input.CapitalCost / input.NetPlantCapacity;
    const AnnualFuelConsumption = FuelConsumptionRate * AnnualHours;
    const AnnualAshDisposal = AnnualFuelConsumption * input.FuelAshConcentration / 100;
    // Expenses--base year
    const TotalNonFuelExpenses = input.LaborCost + input.MaintenanceCost + input.InsurancePropertyTax + input.Utilities
        + input.AshDisposal + input.Management + input.OtherOperatingExpenses;
    const TotalExpensesIncludingFuel = input.FuelCost * AnnualFuelConsumption + TotalNonFuelExpenses;
    const FuelCostKwh = CalcKwh(AnnualFuelConsumption * input.FuelCost);
    const LaborCostKwh = CalcKwh(input.LaborCost);
    const MaintenanceCostKwh = CalcKwh(input.MaintenanceCost);
    const InsurancePropertyTaxKwh = CalcKwh(input.InsurancePropertyTax);
    const UtilitiesKwh = CalcKwh(input.Utilities);
    const AshDisposalKwh = CalcKwh(input.AshDisposal);
    const ManagementKwh = CalcKwh(input.Management);
    const OtherOperatingExpensesKwh = CalcKwh(input.OtherOperatingExpenses);
    const TotalNonFuelExpensesKwh = LaborCostKwh + MaintenanceCostKwh + InsurancePropertyTaxKwh
        + UtilitiesKwh + AshDisposalKwh + ManagementKwh + OtherOperatingExpensesKwh;
    const TotalExpensesIncludingFuelKwh = FuelCostKwh + TotalNonFuelExpensesKwh;
    function CalcKwh(cost: number) {
        return cost / AnnualGeneration;
    }
    // Taxes
    input.FederalTaxRate = 34;
    input.StateTaxRate = 9.6;
    input.ProductionTaxCredit = 0.009;
    const CombinedTaxRate = input.StateTaxRate + input.FederalTaxRate * (1 - input.StateTaxRate / 100);
    // Financing
    input.DebtRatio = 75;
    const EquityRatio = 100 - input.DebtRatio;
    input.InterestRateOnDebt = 5;
    input.EconomicLife = 20;
    input.CostOfEquity = 15;
    const CostOfMoney = input.DebtRatio / 100 * input.InterestRateOnDebt + EquityRatio / 100 * input.CostOfEquity;
    const TotalCostOfPlant = input.CapitalCost;
    const TotalEquityCost = TotalCostOfPlant * EquityRatio / 100;
    const TotalDebtCost = TotalCostOfPlant * input.DebtRatio / 100;
    const CapitalRecoveryFactorEquity = CapitalRecoveryFactor(input.CostOfEquity, input.EconomicLife);
    const CapitalRecoveryFactorDebt = CapitalRecoveryFactor(input.InterestRateOnDebt, input.EconomicLife);
    const AnnualEquityRecovery = CapitalRecoveryFactorEquity * TotalEquityCost;
    const AnnualDebtPayment = TotalDebtCost * CapitalRecoveryFactorDebt;
    const DebtReserve = AnnualDebtPayment;
    function CapitalRecoveryFactor(i: number, N: number) {
        const A = i / 100 * Math.pow((1 + i / 100), N) / (Math.pow((1 + i / 100), N) - 1);
        return A;
    }
    // Income other than energy
    input.CapacityPayment = 166;
    input.InterestRateonDebtReserve = 5;
    const AnnualCapacityPayment = input.CapacityPayment * input.NetPlantCapacity;
    const AnnualDebtReserveInterest = DebtReserve * input.InterestRateonDebtReserve / 100;
    // Escalation/Inflation
    input.GeneralInflation = 2.1;
    input.EscalationFuel = 2.1;
    input.EscalationForProductionTaxCredit = 2.1;
    input.EscalationOther = 2.1;
    // Depreciation Schedule
    const DepreciationFraction = 1 / input.EconomicLife;
    // Annual Cash Flows
    const cashFlow = [];
    for (let i = 0; i < 20; i++) {
        const newCashFlow: CashFlow = { EquityRecovery: 0, EquityInterest: 0, EquityPrincipalPaid: 0,
                                        EquityPrincipalRemaining: 0, DebtRecovery: 0, DebtInterest: 0,
                                        DebtPrincipalPaid: 0, DebtPrincipalRemaining: 0, FuelCost: 0,
                                        NonFuelExpenses: 0, DebtReserve: 0, Depreciation: 0, CapacityIncome: 0,
                                        InterestOnDebtReserve: 0, TaxesWoCredit: 0, TaxCredit: 0, Taxes: 0,
                                        EnergyRevenueRequired: 0 };
        cashFlow.push(newCashFlow);
    }
    cashFlow[0].EquityRecovery = AnnualEquityRecovery;
    cashFlow[0].EquityInterest = input.CostOfEquity / 100 * TotalEquityCost;
    cashFlow[0].EquityPrincipalPaid = cashFlow[0].EquityRecovery - cashFlow[0].EquityInterest;
    cashFlow[0].EquityPrincipalRemaining = TotalEquityCost - cashFlow[0].EquityPrincipalPaid;
    cashFlow[0].DebtRecovery = AnnualDebtPayment;
    cashFlow[0].DebtInterest = input.InterestRateOnDebt / 100 * TotalDebtCost;
    cashFlow[0].DebtPrincipalPaid = cashFlow[0].DebtRecovery - cashFlow[0].DebtInterest;
    cashFlow[0].DebtPrincipalRemaining = TotalDebtCost - cashFlow[0].DebtPrincipalPaid;
    cashFlow[0].FuelCost = AnnualFuelConsumption * input.FuelCost;
    cashFlow[0].NonFuelExpenses = TotalNonFuelExpenses;
    cashFlow[0].DebtReserve = DebtReserve;
    cashFlow[0].Depreciation = TotalCostOfPlant * DepreciationFraction;
    cashFlow[0].CapacityIncome = AnnualCapacityPayment;
    cashFlow[0].InterestOnDebtReserve = AnnualDebtReserveInterest;
    cashFlow[0].TaxesWoCredit = ((CombinedTaxRate / 100) / (1 - CombinedTaxRate / 100))
        * (cashFlow[0].EquityPrincipalPaid + cashFlow[0].DebtPrincipalPaid + cashFlow[0].EquityInterest
            - cashFlow[0].Depreciation + DebtReserve);
    cashFlow[0].TaxCredit = AnnualGeneration * input.ProductionTaxCredit * input.TaxCreditFrac[0];
    cashFlow[0].Taxes = ((CombinedTaxRate / 100) / (1 - CombinedTaxRate / 100))
        * (cashFlow[0].EquityPrincipalPaid + cashFlow[0].DebtPrincipalPaid + cashFlow[0].EquityInterest
            - cashFlow[0].Depreciation + DebtReserve - cashFlow[0].TaxCredit);
    cashFlow[0].EnergyRevenueRequired = cashFlow[0].EquityRecovery + cashFlow[0].DebtRecovery
        + cashFlow[0].FuelCost + cashFlow[0].NonFuelExpenses + cashFlow[0].Taxes + DebtReserve
        - cashFlow[0].CapacityIncome - cashFlow[0].InterestOnDebtReserve;

    return {
            'Electrical and Fuel--base year':
                {'AnnualHours': AnnualHours, 'FuelConsumptionRate': FuelConsumptionRate,
                 'AnnualGeneration': AnnualGeneration, 'CapitalCostNEC': CapitalCostNEC,
                 'AnnualFuelConsumption': AnnualFuelConsumption, 'AnnualAshDisposal': AnnualAshDisposal},
            'Expenses--base year':
                {'TotalNonFuelExpenses': TotalNonFuelExpenses, 'TotalExpensesIncludingFuel': TotalExpensesIncludingFuel,
                 'FuelCostKwh': FuelCostKwh, 'LaborCostKwh': LaborCostKwh, 'MaintenanceCostKwh': MaintenanceCostKwh,
                 'InsurancePropertyTaxKwh': InsurancePropertyTaxKwh, 'UtilitiesKwh': UtilitiesKwh,
                 'AshDisposalKwh': AshDisposalKwh, 'ManagementKwh': ManagementKwh,
                 'OtherOperatingExpensesKwh': OtherOperatingExpensesKwh,
                 'TotalNonFuelExpensesKwh': TotalNonFuelExpensesKwh,
                 'TotalExpensesIncludingFuelKwh': TotalExpensesIncludingFuelKwh},
            'Taxes':
                 {
                    'CombinedTaxRate': CombinedTaxRate
                 },
            'Income other than energy':
                {
                    'AnnualCapacityPayment': AnnualCapacityPayment,
                    'AnnualDebtReserveInterest': AnnualDebtReserveInterest
                },
            'Financing':
                {
                    'EquityRatio': EquityRatio,
                    'CostOfMoney': CostOfMoney,
                    'TotalCostOfPlant': TotalCostOfPlant,
                    'TotalEquityCost': TotalEquityCost,
                    'TotalDebtCost': TotalDebtCost,
                    'CapitalRecoveryFactorEquity': CapitalRecoveryFactorEquity,
                    'CapitalRecoveryFactorDebt': CapitalRecoveryFactorDebt,
                    'AnnualEquityRecovery': AnnualEquityRecovery,
                    'AnnualDebtPayment': AnnualDebtPayment,
                    'DebtReserve': DebtReserve
                },
            'cashFlow0': cashFlow[0]
            };
}

export { GenericPowerOnly };
