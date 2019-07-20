import { InputVarMod } from './tea.model';

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
    const FuelCostKwh = AnnualFuelConsumption * input.FuelCost / AnnualGeneration;
    const LaborCostKwh = input.LaborCost / AnnualGeneration;
    const MaintenanceCostKwh = input.MaintenanceCost / AnnualGeneration;
    const InsurancePropertyTaxKwh = input.InsurancePropertyTax / AnnualGeneration;
    const UtilitiesKwh = input.Utilities / AnnualGeneration;
    const AshDisposalKwh = input.AshDisposal / AnnualGeneration;
    const ManagementKwh = input.Management / AnnualGeneration;
    const OtherOperatingExpensesKwh = input.OtherOperatingExpenses / AnnualGeneration;
    const TotalNonFuelExpensesKwh = LaborCostKwh + MaintenanceCostKwh + InsurancePropertyTaxKwh
        + UtilitiesKwh + AshDisposalKwh + ManagementKwh + OtherOperatingExpensesKwh;
    const TotalExpensesIncludingFuelKwh = FuelCostKwh + TotalNonFuelExpensesKwh;

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
                 'TotalExpensesIncludingFuelKwh': TotalExpensesIncludingFuelKwh}
            };
}

export { GenericPowerOnly };
