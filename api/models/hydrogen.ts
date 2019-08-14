import { CashFlowHydrogen, HydrogenInputMod, TotalCashFlowHydrogen } from './hydrogen.model';

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
    // Depreciation Schedule
    const DepreciationFraction = 1 / input.EconomicLife;
    // Annual Cash Flows
    const cashFlow = [];
    for (let i = 0; i < input.EconomicLife; i++) {
        const newCF: CashFlowHydrogen = { Year: 0, EquityRecovery: 0, EquityInterest: 0, EquityPrincipalPaid: 0,
                                          EquityPrincipalRemaining: 0, DebtRecovery: 0, DebtInterest: 0,
                                          DebtPrincipalPaid: 0, DebtPrincipalRemaining: 0, FuelCost: 0,
                                          NonFuelExpenses: 0, Expenses: 0, DebtReserve: 0, Depreciation: 0,
                                          IncomeElectricalEnergy: 0, IncomeIncentivePayments: 0, IncomeCapacity: 0,
                                          IncomeHeat: 0, IncomeResidue: 0, InterestOnDebtReserve: 0, TaxesWoCredit: 0,
                                          TaxCredit: 0, Taxes: 0, EnergyRevenueRequired: 0 };
        cashFlow.push(newCF);
    }

    for (let i = 0; i < input.EconomicLife; i++) {
        cashFlow[i] = CalcCashFlow(cashFlow[i - 1], i + 1);
    }

    function CalcCashFlow(CF: CashFlowHydrogen, Year: number) {
        const newCF: CashFlowHydrogen = { Year: 0, EquityRecovery: 0, EquityInterest: 0, EquityPrincipalPaid: 0,
                                          EquityPrincipalRemaining: 0, DebtRecovery: 0, DebtInterest: 0,
                                          DebtPrincipalPaid: 0, DebtPrincipalRemaining: 0, FuelCost: 0,
                                          NonFuelExpenses: 0, Expenses: 0, DebtReserve: 0, Depreciation: 0,
                                          IncomeElectricalEnergy: 0, IncomeIncentivePayments: 0, IncomeCapacity: 0,
                                          IncomeHeat: 0, IncomeResidue: 0, InterestOnDebtReserve: 0, TaxesWoCredit: 0,
                                          TaxCredit: 0, Taxes: 0, EnergyRevenueRequired: 0 };
        newCF.Year = Year;
        newCF.EquityRecovery = AnnualEquityRepayment;
        if (Year === 1) {
            newCF.EquityInterest = input.MARR / 100 * TotalEquityPrincipal;
        } else {
            newCF.EquityInterest = input.MARR / 100 * CF.EquityPrincipalRemaining;
        }
        newCF.EquityPrincipalPaid = newCF.EquityRecovery - newCF.EquityInterest;
        if (Year === 1) {
            newCF.EquityPrincipalRemaining = TotalEquityPrincipal - newCF.EquityPrincipalPaid;
        } else {
            newCF.EquityPrincipalRemaining = CF.EquityPrincipalRemaining - newCF.EquityPrincipalPaid;
        }
        newCF.DebtRecovery = AnnualDebtRepayment;
        if (Year === 1) {
            newCF.DebtInterest = input.InterestRateOnDebt / 100 * TotalDebtPrincipal;
        } else {
            newCF.DebtInterest = input.InterestRateOnDebt / 100 * CF.DebtPrincipalRemaining;
        }
        newCF.DebtPrincipalPaid = newCF.DebtRecovery - newCF.DebtInterest;
        if (Year === 1) {
            newCF.DebtPrincipalRemaining = TotalDebtPrincipal - newCF.DebtPrincipalPaid;
            newCF.FuelCost = AnnualFeedstockCost;
            newCF.NonFuelExpenses = OperatingExpenses;
            newCF.DebtReserve = DebtReserve;
        } else {
            newCF.DebtPrincipalRemaining = CF.DebtPrincipalRemaining - newCF.DebtPrincipalPaid;
            newCF.FuelCost = AnnualFeedstockCost * Math.pow(1 + input.EscalationFeedstock / 100, Year - 1);
            newCF.NonFuelExpenses = OperatingExpenses * Math.pow(1 + input.EscalationOther / 100, Year - 1);
            if (Year === input.EconomicLife) { // last year
                newCF.DebtReserve = -DebtReserve;
            } else {
                newCF.DebtReserve = 0;
            }
        }
        newCF.Expenses = newCF.FuelCost + newCF.NonFuelExpenses;
        newCF.Depreciation = AmountOfCapitalFinancing * DepreciationFraction;
        if (Year === 1) {
            newCF.IncomeElectricalEnergy = input.ElectricalEnergy;
            newCF.IncomeIncentivePayments = input.IncentivePayments;
            newCF.IncomeCapacity = input.Capacity;
            newCF.IncomeHeat = input.Heat;
            newCF.IncomeResidue = input.Residues;
        } else {
            newCF.IncomeElectricalEnergy
                = input.ElectricalEnergy * Math.pow(1 + input.EscalationElectricalEnergy / 100, Year - 1);
            newCF.IncomeIncentivePayments
                = input.IncentivePayments * Math.pow(1 + input.EscalationIncentivePayments / 100, Year - 1);
            newCF.IncomeCapacity
                = input.Capacity * Math.pow(1 + input.EscalationCapacityPayment / 100, Year - 1);
            newCF.IncomeHeat
                = input.Heat * Math.pow(1 + input.EscalationHeatSales / 100, Year - 1);
            newCF.IncomeResidue
                = input.Residues * Math.pow(1 + input.EscalationResidueSales / 100, Year - 1);
        }
        newCF.InterestOnDebtReserve = AnnualDebtReserveInterest;
        newCF.TaxesWoCredit = ((CombinedTaxRate / 100) / (1 - CombinedTaxRate / 100))
            * (newCF.EquityPrincipalPaid + newCF.DebtPrincipalPaid + newCF.EquityInterest
                - newCF.Depreciation + newCF.DebtReserve);
        if (Year === 1) {
            newCF.TaxCredit = AnnualHydrogenEnergy * input.ProductionTaxCredit * input.TaxCreditFrac[0];
        } else {
            newCF.TaxCredit = AnnualHydrogenEnergy * input.ProductionTaxCredit
                * Math.pow((1 + input.EscalationProductionTaxCredit / 100), (Year - 1)) * input.TaxCreditFrac[Year - 1];
        }
        newCF.Taxes = (newCF.TaxesWoCredit - newCF.TaxCredit) < 0 ? (input.OneYearDebtReserveRequired ?
            ((CombinedTaxRate / 100) / (1 - (CombinedTaxRate / 100)))
            * (newCF.EquityPrincipalPaid + newCF.DebtPrincipalPaid + newCF.EquityInterest
                - newCF.Depreciation + newCF.DebtReserve - newCF.TaxCredit) : 0)
            : ((CombinedTaxRate / 100) / (1 - (CombinedTaxRate / 100)))
            * (newCF.EquityPrincipalPaid + newCF.DebtPrincipalPaid + newCF.EquityInterest
                - newCF.Depreciation + newCF.DebtReserve - newCF.TaxCredit);
        newCF.EnergyRevenueRequired = newCF.EquityRecovery + newCF.DebtRecovery
            + newCF.FuelCost + newCF.NonFuelExpenses + newCF.Taxes + newCF.DebtReserve
            - newCF.IncomeElectricalEnergy - newCF.IncomeIncentivePayments - newCF.IncomeCapacity
            - newCF.IncomeHeat - newCF.IncomeResidue - newCF.InterestOnDebtReserve;

        return newCF;
    }

    const Total: TotalCashFlowHydrogen = { EquityRecovery: 0, EquityInterest: 0, EquityPrincipalPaid: 0,
                                           DebtRecovery: 0, DebtInterest: 0, DebtPrincipalPaid: 0, FuelCost: 0,
                                           NonFuelExpenses: 0, Expenses: 0, DebtReserve: 0, Depreciation: 0,
                                           IncomeElectricalEnergy: 0, IncomeIncentivePayments: 0, IncomeCapacity: 0,
                                           IncomeHeat: 0, IncomeResidue: 0, InterestOnDebtReserve: 0, TaxesWoCredit: 0,
                                           TaxCredit: 0, Taxes: 0, EnergyRevenueRequired: 0 };
    for (let i = 0; i < cashFlow.length; i++) {
        Total.EquityRecovery += cashFlow[i].EquityRecovery;
        Total.EquityInterest += cashFlow[i].EquityInterest;
        Total.EquityPrincipalPaid += cashFlow[i].EquityPrincipalPaid;
        Total.DebtRecovery += cashFlow[i].DebtRecovery;
        Total.DebtInterest += cashFlow[i].DebtInterest;
        Total.DebtPrincipalPaid += cashFlow[i].DebtPrincipalPaid;
        Total.FuelCost += cashFlow[i].FuelCost;
        Total.NonFuelExpenses += cashFlow[i].NonFuelExpenses;
        Total.Expenses += cashFlow[i].Expenses;
        Total.DebtReserve += cashFlow[i].DebtReserve;
        Total.Depreciation += cashFlow[i].Depreciation;
        Total.IncomeElectricalEnergy += cashFlow[i].IncomeElectricalEnergy;
        Total.IncomeIncentivePayments += cashFlow[i].IncomeIncentivePayments;
        Total.IncomeCapacity += cashFlow[i].IncomeCapacity;
        Total.IncomeHeat += cashFlow[i].IncomeHeat;
        Total.IncomeResidue += cashFlow[i].IncomeResidue;
        Total.InterestOnDebtReserve += cashFlow[i].InterestOnDebtReserve;
        Total.TaxesWoCredit += cashFlow[i].TaxesWoCredit;
        Total.TaxCredit += cashFlow[i].TaxCredit;
        Total.Taxes += cashFlow[i].Taxes;
        Total.EnergyRevenueRequired += cashFlow[i].EnergyRevenueRequired;
    }
    // Current $ Level Annual Cost (LAC)
    const PresentWorth = [];
    let TotalPresentWorth = 0;
    for (let i = 0; i < cashFlow.length; i++) {
        const newPW = PW(cashFlow[i].EnergyRevenueRequired, input.MARR, i + 1);
        PresentWorth.push(newPW);
        TotalPresentWorth += newPW;
    }
    function PW(EnergyRevenueRequired: number, CostOfEquity: number, Year: number) {
        return EnergyRevenueRequired * Math.pow((1 + CostOfEquity / 100), -Year);
    }
    const CapitalRecoveryFactorCurrent = CapitalRecoveryFactorEquity;
    const CurrentLevelAnnualRevenueRequirements = CapitalRecoveryFactorEquity * TotalPresentWorth;
    const ConstantLevelAnnualRevenueRequirements = TotalPresentWorth * CapitalRecoveryFactorEquityConstant;
    const CurrentLACofEnergy = CurrentLevelAnnualRevenueRequirements / AnnualHydrogenProductionKg;

    const ConstantLACofEnergy = ConstantLevelAnnualRevenueRequirements / AnnualHydrogenProductionKg;

    return {
            'AnnualCashFlows': cashFlow,
            'TotalCashFlow': Total,
            'TotalPresentWorth': TotalPresentWorth,
            'CurrentLevelAnnualRevenueRequirements': CurrentLevelAnnualRevenueRequirements,
            'ConstantLevelAnnualRevenueRequirements': ConstantLevelAnnualRevenueRequirements,
            'CurrentLACofEnergy': CurrentLACofEnergy,
            'ConstantLACofEnergy': ConstantLACofEnergy
        };
}

export { Hydrogen };
