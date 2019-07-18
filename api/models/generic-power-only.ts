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

    return {
            'Electrical and Fuel--base year':
                {'AnnualHours': AnnualHours, 'FuelConsumptionRate': FuelConsumptionRate,
                 'AnnualGeneration': AnnualGeneration, 'CapitalCostNEC': CapitalCostNEC,
                 'AnnualFuelConsumption': AnnualFuelConsumption, 'AnnualAshDisposal': AnnualAshDisposal}
            };
}

export { GenericPowerOnly };
