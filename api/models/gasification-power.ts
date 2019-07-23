import { CashFlow, InputVarMod, TotalCashFlow } from './tea.model';

function GasificationPower(input: InputVarMod) {
    // Unit Conversion
    const KjPerCubicMeter = input.BtuPerCubicFoot * 1.055056 * 35.31;
    const KjPerKg = input.BtuPerPound * 1.055056 / 0.4535924;
    const USTonsPerHour = input.MetricTonsPerHour / 0.907;
    const DollarPerUSTons = input.DollarPerMetricTons / 0.907;
    const CubicMeterPerKg = input.CubicFootPerPonds / 35.31 * 2.205;
    const DollarPerMillionBtu = input.DollarPerMillionBtu / 1055 * 3.6;
    // Fuel Properties
    const CODensity = 101325 * 28 / 8314 / 298;
    const H2Density = 101325 * 2 / 8314 / 298;
    const CH4Density = 101325 * 16 / 8314 / 298;
    const GasolineHigherHeatingValueKjPerL = input.GasolineHigherHeatingValueMjPerKg * input.GasolineDensity;
    const GasolineLowerHeatingValueKjPerL = input.GasolineLowerHeatingValueMjPerKg * input.GasolineDensity;
    const LightDieselHigherHeatingValueKjPerL = input.LightDieselHigherHeatingValueMjPerKg * input.LightDieselDensity;
    const LightDieselLowerHeatingValueKjPerL = input.LightDieselLowerHeatingValueMjPerKg * input.LightDieselDensity;
    const HeavyDieselHigherHeatingValueKjPerL = input.HeavyDieselHigherHeatingValueMjPerKg * input.HeavyDieselDensity;
    const HeavyDieselLowerHeatingValueKjPerL = input.HeavyDieselLowerHeatingValueMjPerKg * input.HeavyDieselDensity;
    const NaturalGasHigherHeatingValueKjPerL = input.NaturalGasHigherHeatingValueMjPerKg
        * input.NaturalGasDensity * 1000;
    const NaturalGasLowerHeatingValueKjPerL = input.NaturalGasLowerHeatingValueMjPerKg * input.NaturalGasDensity * 1000;
    const COHigherHeatingValueKjPerM = input.COHigherHeatingValueMjPerKg * CODensity * 1000;
    const COLowerHeatingValueKjPerM = input.COLowerHeatingValueMjPerKg * CODensity * 1000;
    const H2HigherHeatingValueKjPerM = input.H2HigherHeatingValueMjPerKg * H2Density * 1000;
    const H2LowerHeatingValueKjPerM = input.H2LowerHeatingValueMjPerKg * H2Density * 1000;
    const CH4HigherHeatingValueKjPerM = input.CH4HigherHeatingValueMjPerKg * CH4Density * 1000;
    const CH4LowerHeatingValueKjPerM = input.CH4LowerHeatingValueMjPerKg * CH4Density * 1000;
    // Capital Cost
    const GasifierSystemCapitalCostPerKwe = input.GasifierSystemCapitalCost / input.NetElectricalCapacity;
    const GasCleaningSystemCapitalCostPerKwe = input.GasCleaningSystemCapitalCost / input.NetElectricalCapacity;
    const PowerGenerationCapitalCostPerKwe = input.PowerGenerationCapitalCost / input.NetElectricalCapacity;
    const EmissionControlSystemCapitalCostPerKwe = input.EmissionControlSystemCapitalCost / input.NetElectricalCapacity;
    const HeatRecoverySystemCapitalCostPerKwe = input.HeatRecoverySystemCapitalCost / input.NetElectricalCapacity;
    const TotalFacilityCapitalCost = input.GasifierSystemCapitalCost + input.GasCleaningSystemCapitalCost +
        input.PowerGenerationCapitalCost + input.EmissionControlSystemCapitalCost +
        input.HeatRecoverySystemCapitalCost;
    const TotalFacilityCapitalCostPerKwe = TotalFacilityCapitalCost / input.NetElectricalCapacity;
    // Electrical and Fuel--base year
    const ParasiticLoad = input.GrossElectricalCapacity - input.NetElectricalCapacity;
    const AnnualHours = input.CapacityFactor / 100 * 8760;
    const AnnualNetElectricityGeneration = input.NetElectricalCapacity * AnnualHours;
    const OverallNetSystemEfficiency = input.HHVEfficiencyOfGasificationSystem * input.NetHHVEfficiencyofPowerGeneration
        / 100;
    const NitrogenGas = 100 - (input.CO + input.HydrogenGas + input.Hydrocarbons + input.CarbonDioxide + input.Oxygen);
    const CleanGasMolecularMass = (input.CO * 28 + input.HydrogenGas * 2 + input.Hydrocarbons * 16 + input.CarbonDioxide
            * 44 + input.Oxygen * 32 + NitrogenGas * 28) / 100;
    const CleanGasDensity = 101325 * CleanGasMolecularMass / 8314 / 298;
    const CleanGasHigherHeatingValue = (input.CO * COHigherHeatingValueKjPerM + input.HydrogenGas
        * H2HigherHeatingValueKjPerM + input.Hydrocarbons * CH4HigherHeatingValueKjPerM) / 100;
    const CleanGasLowerHeatingValue = (input.CO * COLowerHeatingValueKjPerM + input.HydrogenGas
        * H2LowerHeatingValueKjPerM + input.Hydrocarbons * CH4LowerHeatingValueKjPerM) / 100;
    const TotalFuelPowerInput = input.NetElectricalCapacity / (input.NetHHVEfficiencyofPowerGeneration / 100);
    const CleanGasPowerInput = TotalFuelPowerInput * (1 - input.FractionOfInputEnergy / 100);
    const DualFuelPowerInput = TotalFuelPowerInput * input.FractionOfInputEnergy / 100;
    const CleanGasFlowRateVolume = CleanGasPowerInput / CleanGasHigherHeatingValue * 3600;
    const CleanGasFlowRateMass = CleanGasFlowRateVolume * CleanGasDensity;
    const AnnualCleanGasConsumption = CleanGasFlowRateMass * AnnualHours / 1000;
    const DualFuelFlowRate = DualFuelPowerInput / HeavyDieselHigherHeatingValueKjPerL * 3600;
    const AnnualDualFuelConsumption = DualFuelFlowRate * AnnualHours;
    const BiomassFeedRate = CleanGasPowerInput / (input.HHVEfficiencyOfGasificationSystem / 100)
        / input.HigherHeatingValue * 3600;
    const AnnualBiomassConsumptionDryMass = BiomassFeedRate * AnnualHours / 1000;
    const AnnualBiomassConsumptionWetMass = AnnualBiomassConsumptionDryMass / (1 - input.MoistureContent / 100);
    const CharProductionRate = input.AshContent / 100 * BiomassFeedRate / (1 - input.CarbonConcentration / 100);
    const AnnualCharProduction = CharProductionRate * AnnualHours / 1000;

    // Heat--base year
    // Expenses--base year
    // Taxes
    // Income other than energy
    // Escalation/Inflation
    // Financing
    // Depreciation Schedule
    // Tax Credit Schedule
    // Annual Cash Flows
    // Current $ Level Annual Cost (LAC)
    return {
        'Unit Conversions': {
                'KjPerCubicMeter': KjPerCubicMeter,
                'KjPerKg': KjPerKg,
                'USTonsPerHour': USTonsPerHour,
                'DollarPerUSTons': DollarPerUSTons,
                'CubicMeterPerKg': CubicMeterPerKg,
                'DollarPerMillionBtu': DollarPerMillionBtu
        },
        'Fuel Properties': {
            'CODensity': CODensity,
            'H2Density': H2Density,
            'CH4Density': CH4Density,
            'GasolineHigherHeatingValueKjPerL': GasolineHigherHeatingValueKjPerL,
            'GasolineLowerHeatingValueKjPerL': GasolineLowerHeatingValueKjPerL,
            'LightDieselHigherHeatingValueKjPerL': LightDieselHigherHeatingValueKjPerL,
            'LightDieselLowerHeatingValueKjPerL': LightDieselLowerHeatingValueKjPerL,
            'HeavyDieselHigherHeatingValueKjPerL': HeavyDieselHigherHeatingValueKjPerL,
            'HeavyDieselLowerHeatingValueKjPerL': HeavyDieselLowerHeatingValueKjPerL,
            'NaturalGasHigherHeatingValueKjPerL': NaturalGasHigherHeatingValueKjPerL,
            'NaturalGasLowerHeatingValueKjPerL': NaturalGasLowerHeatingValueKjPerL,
            'COHigherHeatingValueKjPerM': COHigherHeatingValueKjPerM,
            'COLowerHeatingValueKjPerM': COLowerHeatingValueKjPerM,
            'H2HigherHeatingValueKjPerM': H2HigherHeatingValueKjPerM,
            'H2LowerHeatingValueKjPerM': H2LowerHeatingValueKjPerM,
            'CH4HigherHeatingValueKjPerM': CH4HigherHeatingValueKjPerM,
            'CH4LowerHeatingValueKjPerM': CH4LowerHeatingValueKjPerM
        },
        'Capital Cost': {
            'GasifierFeedstockCapitalCostPerKwe': GasifierSystemCapitalCostPerKwe,
            'GasCleaningSystemCapitalCostPerKwe': GasCleaningSystemCapitalCostPerKwe,
            'PowerGenerationCapitalCostPweKwe': PowerGenerationCapitalCostPerKwe,
            'EmissionControlSystemCapitalCostPerKwe': EmissionControlSystemCapitalCostPerKwe,
            'HeatRecoverySystemCapitalCostPerKwe': HeatRecoverySystemCapitalCostPerKwe,
            'TotalFacilityCapitalCost': TotalFacilityCapitalCost,
            'TotalFacilityCapitalCostPerKwe': TotalFacilityCapitalCostPerKwe

        },
        'Electrical and Fuel--Base Year': {
            'ParasiticLoad': ParasiticLoad,
            'AnnualHours': AnnualHours,
            'AnnualNetElectricityGeneration': AnnualNetElectricityGeneration,
            'OverallNetSystemEfficiency': OverallNetSystemEfficiency,
            'NitrogenGas': NitrogenGas,
            'CleanGasMolecularMass': CleanGasMolecularMass,
            'CleanGasDensity': CleanGasDensity,
            'CleanGasHigherHeatingValue': CleanGasHigherHeatingValue,
            'CleanGasLowerHeatingValue': CleanGasLowerHeatingValue,
            'TotalFuelPowerInput': TotalFuelPowerInput,
            'CleanGasPowerInput': CleanGasPowerInput,
            'DualFuelPowerInput': DualFuelPowerInput,
            'CleanGasFlowRateVolume': CleanGasFlowRateVolume,
            'CleanGasFlowRateMass': CleanGasFlowRateMass,
            'AnnualCleanGasConsumption': AnnualCleanGasConsumption,
            'DualFuelFlowRate': DualFuelFlowRate,
            'AnnualDualFuelConsumption': AnnualDualFuelConsumption,
            'BiomassFeedRate': BiomassFeedRate,
            'AnnualBiomassConsumptionDryMass': AnnualBiomassConsumptionDryMass,
            'AnnualBiomassConsumptionWetMass': AnnualBiomassConsumptionWetMass,
            'CharProductionRate': CharProductionRate,
            'AnnualCharProduction': AnnualCharProduction
        }
    };
}

export { GasificationPower };
