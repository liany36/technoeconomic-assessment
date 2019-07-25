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
    // Capital Cost
    const CapitalCostUnitDaily = input.CapitalCost / input.GrossDesignHydrogenCapacity;
    const CapitalCostUnitYear = input.CapitalCost / AnnualHydrogenProductionKg;
    // Expenses--base year
    const AnnualFeedstockCost = input.FeedstockCost * AnnualFeedstockSupply;
    const OperatingExpenses = input.CapitalCost * input.OperatingExpensesRate / 100;
    const TotalAnnualExpenses = AnnualFeedstockCost + OperatingExpenses;
    // Taxes and Tax credit
    const CombinedTaxRate = input.StateTaxRate + input.FederalTaxRate * (1 - input.StateTaxRate / 100);
    // Financing
    const AmountOfCapitalFinancing = input.CapitalCost;
    const EquityRatio = 100 - input.DebtRatio;
    const WeightedCostOfMoney = input.DebtRatio / 100 * input.InterestRateOnDebt + EquityRatio / 100 * input.MARR;
    const WeightedCapitalRecoveryFactorCurrent = CapitalRecoveryFactor(WeightedCostOfMoney, input.EconomicLife);
    const RealCostOfMoney = ((1 + WeightedCostOfMoney / 100) / (1 + input.GeneralInflation / 100) - 1) * 100;
    const WeightedCapitalRecoveryFactorConstant = CapitalRecoveryFactor(RealCostOfMoney, input.EconomicLife);
    // Debt recovery:
    const TotalDebtPrincipal = AmountOfCapitalFinancing * input.DebtRatio / 100;
    const CapitalRecoveryFactorDebt = CapitalRecoveryFactor(input.InterestRateOnDebt, input.EconomicLife);
    const AnnualDebtRepayment = TotalDebtPrincipal * CapitalRecoveryFactorDebt;
    const TotalDebtRepayment = AnnualDebtRepayment * input.EconomicLife;
    const DebtReserve = input.OneYearDebtReserveRequired === true ? AnnualDebtRepayment : 0;
    // Equity recovery:
    const TotalEquityPrincipal = AmountOfCapitalFinancing * EquityRatio / 100;
    const CapitalRecoveryFactorEquity = CapitalRecoveryFactor(input.MARR, input.EconomicLife);
    const AnnualEquityRepayment = TotalEquityPrincipal * CapitalRecoveryFactorEquity;
    const TotalEquityRepayment = AnnualEquityRepayment * input.EconomicLife;
    const RealCostOfEquityConstant = ((1 + input.MARR / 100) / (1 + input.GeneralInflation / 100) - 1) * 100;
    const CapitalRecoveryFactorEquityConstant = CapitalRecoveryFactor(RealCostOfEquityConstant, input.EconomicLife);
    // Total Debt + Equity Recovery:
    const AnnualTotalCapitalRecovery = AnnualDebtRepayment + AnnualEquityRepayment;
    const TotalCapitalRecovery = TotalDebtRepayment + TotalEquityRepayment;
    // Debt reserve;
    const AnnualDebtReserveInterest = DebtReserve * input.InterestRateOnDebtReserve / 100;
    function CapitalRecoveryFactor(i: number, N: number) {
        const A = i / 100 * Math.pow((1 + i / 100), N) / (Math.pow((1 + i / 100), N) - 1);
        return A;
    }

    return {
        'Hydrogen Generation': {
            'HydrogenEnergy': HydrogenEnergy, 'DesignHydrogenProductionRateMW': DesignHydrogenProductionRateMW,
            'DesignHydrogenProductionRateMg': DesignHydrogenProductionRateMg, 'FeedstockInput': FeedstockInput,
            'FeedstockSupply': FeedstockSupply, 'AnnualHours': AnnualHours,
            'AnnualFeedstockSupply': AnnualFeedstockSupply, 'AnnualFeedstockEnergyInput': AnnualFeedstockEnergyInput,
            'AnnualHydrogenProductionMg': AnnualHydrogenProductionMg,
            'AnnualHydrogenProductionKg': AnnualHydrogenProductionKg, 'AnnualHydrogenEnergy': AnnualHydrogenEnergy
        },
        'Capital Cost': {
            'CapitalCostUnitDaily': CapitalCostUnitDaily, 'CapitalCostUnitYear': CapitalCostUnitYear
        },
        'Expenses--base year': {
            'AnnualFeedstockCost': AnnualFeedstockCost, 'OperatingExpenses': OperatingExpenses,
            'TotalAnnualExpenses': TotalAnnualExpenses
        },
        'Taxes and Tax credit': {
            'CombinedTaxRate': CombinedTaxRate
        },
        'Financing': {
            'AmountOfCapitalFinancing': AmountOfCapitalFinancing, 'EquityRatio': EquityRatio,
            'WeightedCostOfMoney': WeightedCostOfMoney,
            'WeightedCapitalRecoveryFactorCurrent': WeightedCapitalRecoveryFactorCurrent,
            'RealCostOfMoney': RealCostOfMoney,
            'WeightedCapitalRecoveryFactorConstant': WeightedCapitalRecoveryFactorConstant,
            'Debt recovery': {
                'TotalDebtPrincipal': TotalDebtPrincipal, 'CapitalRecoveryFactorDebt': CapitalRecoveryFactorDebt,
                'AnnualDebtRepayment': AnnualDebtRepayment, 'TotalDebtRepayment': TotalDebtRepayment,
                'DebtReserve': DebtReserve
            },
            'Equity recovery': {
                'TotalEquityPrincipal': TotalEquityPrincipal,
                'CapitalRecoveryFactorEquity': CapitalRecoveryFactorEquity,
                'AnnualEquityRepayment': AnnualEquityRepayment, 'TotalEquityRepayment': TotalEquityRepayment,
                'RealCostOfEquityConstant': RealCostOfEquityConstant,
                'CapitalRecoveryFactorEquityConstant': CapitalRecoveryFactorEquityConstant
            },
            'Total Debt + Equity Recovery': {
                'AnnualTotalCapitalRecovery': AnnualTotalCapitalRecovery, 'TotalCapitalRecovery': TotalCapitalRecovery
            },
            'Debt reserve': {
                'AnnualDebtReserveInterest': AnnualDebtReserveInterest
            }
        }
    };
}

export { Hydrogen };
