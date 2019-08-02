import { UnitConversionInputVar } from './unit-conversion-model';
function UnitConversion(input: UnitConversionInputVar) {
    // Unit Conversion
    const KjPerCubicMeter = input.BtuPerCubicFoot * 1.055056 * 35.31;
    const KjPerKg = input.BtuPerPound * 1.055056 / 0.4535924;
    const USTonsPerHour = input.MetricTonsPerHour / 0.907;
    const DollarPerUSTons = input.DollarPerMetricTons / 0.907;
    const CubicMeterPerKg = input.CubicFootPerPonds / 35.31 * 2.205;
    const DollarPerMillionBtu = input.DollarPerMillionBtu / 1055 * 3.6;
    return {
        'Unit Conversions': {
            'KjPerCubicMeter': KjPerCubicMeter,
            'KjPerKg': KjPerKg,
            'USTonsPerHour': USTonsPerHour,
            'DollarPerUSTons': DollarPerUSTons,
            'CubicMeterPerKg': CubicMeterPerKg,
            'DollarPerMillionBtu': DollarPerMillionBtu
        },
    };
}

export { UnitConversion };
