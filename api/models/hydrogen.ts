import { HydrogenInputMod } from './tea.model';

function Hydrogen(input: HydrogenInputMod) {
    // Hydrogen Generation
    const HydrogenEnergy = input.GrossDesignHydrogenCapacity * input.HydrogenHHV;
    const DesignHydrogenProductionRateMW = HydrogenEnergy / 24 / 3600;
    const DesignHydrogenProductionRateMg = input.GrossDesignHydrogenCapacity / 24 / 1000;
    const FeedstockInput = DesignHydrogenProductionRateMW / (input.OverallProductionEfficiency / 100);
    const FeedstockSupply = FeedstockInput / input.Feedstock * 3600 / 1000;
    const AnnualHours = 8760 * input.CapacityFactor / 100;
    const AnnualFeedstockSupply = FeedstockSupply * AnnualHours;
    const AnnualFeedstockEnergyInput = AnnualFeedstockSupply * 1000 * input.Feedstock / 1000000000;
    const AnnualHydrogenProductionMg = DesignHydrogenProductionRateMg * AnnualHours;
    const AnnualHydrogenProductionKg = AnnualHydrogenProductionMg * 1000;
    const AnnualHydrogenEnergy = AnnualHydrogenProductionMg * 1000 * input.HydrogenHHV / 1000;

    return {
        'Hydrogen Generation': {
            'HydrogenEnergy': HydrogenEnergy, 'DesignHydrogenProductionRateMW': DesignHydrogenProductionRateMW,
            'DesignHydrogenProductionRateMg': DesignHydrogenProductionRateMg, 'FeedstockInput': FeedstockInput,
            'FeedstockSupply': FeedstockSupply, 'AnnualHours': AnnualHours,
            'AnnualFeedstockSupply': AnnualFeedstockSupply, 'AnnualFeedstockEnergyInput': AnnualFeedstockEnergyInput,
            'AnnualHydrogenProductionMg': AnnualHydrogenProductionMg,
            'AnnualHydrogenProductionKg': AnnualHydrogenProductionKg, 'AnnualHydrogenEnergy': AnnualHydrogenEnergy
        }
    };
}

export { Hydrogen };
