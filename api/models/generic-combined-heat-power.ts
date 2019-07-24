import { GenericCombinedHeatPowerInputMod } from './tea.model';

function GenericCombinedHeatPower(input: GenericCombinedHeatPowerInputMod) {
    // Electrical and Fuel--base year
    const ParasiticLoad = input.GrossElectricalCapacity - input.NetElectricalCapacity;
    const AnnualHours = input.CapacityFactor / 100 * 8760;
    const FuelConsumptionRate = input.NetElectricalCapacity / (input.NetStationEfficiency / 100) * 3600
        / input.FuelHeatingValue / 1000;
    const FuelPower = FuelConsumptionRate * 1000 * input.FuelHeatingValue / 3600;
    const GrossStationElectricalEfficiency = input.GrossElectricalCapacity / FuelPower * 100;
    const AnnualNetGeneration = input.NetElectricalCapacity * 8760 * input.CapacityFactor / 100;
    const AnnualFuelConsumption = FuelConsumptionRate * AnnualHours;
    const CapitalCostNEC = input.CapitalCost / input.NetElectricalCapacity;
    const AnnualAshDisposal = AnnualFuelConsumption * input.FuelAshConcentration / 100;

    return {
            'Electrical and Fuel--base year':
                {'ParasiticLoad': ParasiticLoad, 'AnnualHours': AnnualHours, 'FuelConsumptionRate': FuelConsumptionRate,
                 'FuelPower': FuelPower, 'GrossStationElectricalEfficiency': GrossStationElectricalEfficiency,
                 'AnnualNetGeneration': AnnualNetGeneration, 'AnnualFuelConsumption': AnnualFuelConsumption,
                 'CapitalCostNEC': CapitalCostNEC, 'AnnualAshDisposal': AnnualAshDisposal},
            // 'Expenses--base year':
            // {'TotalNonFuelExpenses': TotalNonFuelExpenses, 'TotalExpensesIncludingFuel': TotalExpensesIncludingFuel,
            //      'FuelCostKwh': FuelCostKwh, 'LaborCostKwh': LaborCostKwh, 'MaintenanceCostKwh': MaintenanceCostKwh,
            //      'InsurancePropertyTaxKwh': InsurancePropertyTaxKwh, 'UtilitiesKwh': UtilitiesKwh,
            //      'AshDisposalKwh': AshDisposalKwh, 'ManagementKwh': ManagementKwh,
            //      'OtherOperatingExpensesKwh': OtherOperatingExpensesKwh,
            //      'TotalNonFuelExpensesKwh': TotalNonFuelExpensesKwh,
            //      'TotalExpensesIncludingFuelKwh': TotalExpensesIncludingFuelKwh},
            // 'Taxes':
            //      {
            //         'CombinedTaxRate': CombinedTaxRate
            //      },
            // 'Income other than energy':
            //     {
            //         'AnnualCapacityPayment': AnnualCapacityPayment,
            //         'AnnualDebtReserveInterest': AnnualDebtReserveInterest
            //     },
            // 'Financing':
            //     {
            //         'EquityRatio': EquityRatio,
            //         'CostOfMoney': CostOfMoney,
            //         'TotalCostOfPlant': TotalCostOfPlant,
            //         'TotalEquityCost': TotalEquityCost,
            //         'TotalDebtCost': TotalDebtCost,
            //         'CapitalRecoveryFactorEquity': CapitalRecoveryFactorEquity,
            //         'CapitalRecoveryFactorDebt': CapitalRecoveryFactorDebt,
            //         'AnnualEquityRecovery': AnnualEquityRecovery,
            //         'AnnualDebtPayment': AnnualDebtPayment,
            //         'DebtReserve': DebtReserve
            //     },
            // 'Annual Cash Flows': cashFlow,
            // 'Total Cash Flow': Total,
            // 'Current $ Level Annual Cost (LAC)':
            //     {
            //         'TotalPresentWorth': TotalPresentWorth,
            //         'CurrentLevelAnnualRevenueRequirements': CurrentLevelAnnualRevenueRequirements,
            //         'CurrentLACofEnergy': CurrentLACofEnergy,
            //         'RealCostOfMoney': RealCostOfMoney / 100,
            //         'CapitalRecoveryFactorConstant': CapitalRecoveryFactorConstant,
            //         'ConstantLevelAnnualRevenueRequirements': ConstantLevelAnnualRevenueRequirements,
            //         'ConstantLACofEnergy': ConstantLACofEnergy
            //     },
            };
}

export { GenericCombinedHeatPower };
