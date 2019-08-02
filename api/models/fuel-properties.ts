import { FuelPropertiesInputVar } from './fuel-properties.model';
function FuelProperties(input: FuelPropertiesInputVar) {
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
    return {
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
        }
    };
}

export { FuelProperties };
