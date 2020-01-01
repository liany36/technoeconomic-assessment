import { InputModHydrogen } from './input.model';
import { CashFlowHydrogen, ConstantLevelAnnualCostMod, CurrentLevelAnnualCostMod, ExpensesBaseYearModHydrogen,
    FinancingMod, HydrogenGenerationMod, OutputModHydrogen, SensitivityAnalysisMod,
    TotalCashFlowHydrogen } from './output.model';

function Hydrogen(input: InputModHydrogen) {
    // Constants
    const HydrogenHHV = 141.93; // Hydrogen Higher Heating Value (MJ/kg)
    const HydrogenLHV = 119.98; // Hydrogen Lower Heating Value (MJ/kg)
    // Hydrogen Generation
    const HydrogenEnergy = input.GrossDesignHydrogenCapacity * HydrogenHHV;
    const DesignHydrogenProductionRateMW = HydrogenEnergy / 24 / 3600;
    const DesignHydrogenProductionRateMg = input.GrossDesignHydrogenCapacity / 24 / 1000;
    const FeedstockInput = DesignHydrogenProductionRateMW / (input.OverallProductionEfficiency / 100);
    const FeedstockSupply = FeedstockInput / input.Feedstock * 3600 / 1000;
    const AnnualHours = 8760 * input.CapacityFactor / 100;
    const AnnualFeedstockSupply = FeedstockSupply * AnnualHours;
    const AnnualFeedstockEnergyInput = AnnualFeedstockSupply * 1000 * input.Feedstock / 1000000000;
    const AnnualHydrogenProductionMg = DesignHydrogenProductionRateMg * AnnualHours;
    const AnnualHydrogenProductionKg = AnnualHydrogenProductionMg * 1000;
    const AnnualHydrogenEnergy = AnnualHydrogenProductionMg * 1000 * HydrogenHHV / 1000;
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
        const newCF: CashFlowHydrogen
        = { Shared:
            {Year: 0, EquityRecovery: 0, EquityInterest: 0, EquityPrincipalPaid: 0, EquityPrincipalRemaining: 0,
             DebtRecovery: 0, DebtInterest: 0, DebtPrincipalPaid: 0, DebtPrincipalRemaining: 0, NonFuelExpenses: 0,
             DebtReserve: 0, Depreciation: 0, IncomeCapacity: 0, InterestOnDebtReserve: 0, TaxesWoCredit: 0,
             TaxCredit: 0, Taxes: 0, EnergyRevenueRequired: 0 },
            FuelCost: 0, Expenses: 0, IncomeElectricalEnergy: 0, IncomeIncentivePayments: 0, IncomeHeat: 0,
            IncomeResidue: 0 };
        cashFlow.push(newCF);
    }
    for (let i = 0; i < input.EconomicLife; i++) {
        cashFlow[i] = CalcCashFlow(cashFlow[i - 1], i + 1);
    }
    function CalcCashFlow(CF: CashFlowHydrogen, Year: number) {
        const newCF: CashFlowHydrogen
        = { Shared:
            {Year: 0, EquityRecovery: 0, EquityInterest: 0, EquityPrincipalPaid: 0, EquityPrincipalRemaining: 0,
             DebtRecovery: 0, DebtInterest: 0, DebtPrincipalPaid: 0, DebtPrincipalRemaining: 0, NonFuelExpenses: 0,
             DebtReserve: 0, Depreciation: 0, IncomeCapacity: 0, InterestOnDebtReserve: 0, TaxesWoCredit: 0,
             TaxCredit: 0, Taxes: 0, EnergyRevenueRequired: 0 },
            FuelCost: 0, Expenses: 0, IncomeElectricalEnergy: 0, IncomeIncentivePayments: 0, IncomeHeat: 0,
            IncomeResidue: 0 };
        newCF.Shared.Year = Year;
        newCF.Shared.EquityRecovery = AnnualEquityRepayment;
        if (Year === 1) {
            newCF.Shared.EquityInterest = input.MARR / 100 * TotalEquityPrincipal;
        } else {
            newCF.Shared.EquityInterest = input.MARR / 100 * CF.Shared.EquityPrincipalRemaining;
        }
        newCF.Shared.EquityPrincipalPaid = newCF.Shared.EquityRecovery - newCF.Shared.EquityInterest;
        if (Year === 1) {
            newCF.Shared.EquityPrincipalRemaining = TotalEquityPrincipal - newCF.Shared.EquityPrincipalPaid;
        } else {
            newCF.Shared.EquityPrincipalRemaining
            = CF.Shared.EquityPrincipalRemaining - newCF.Shared.EquityPrincipalPaid;
        }
        newCF.Shared.DebtRecovery = AnnualDebtRepayment;
        if (Year === 1) {
            newCF.Shared.DebtInterest = input.InterestRateOnDebt / 100 * TotalDebtPrincipal;
        } else {
            newCF.Shared.DebtInterest = input.InterestRateOnDebt / 100 * CF.Shared.DebtPrincipalRemaining;
        }
        newCF.Shared.DebtPrincipalPaid = newCF.Shared.DebtRecovery - newCF.Shared.DebtInterest;
        if (Year === 1) {
            newCF.Shared.DebtPrincipalRemaining = TotalDebtPrincipal - newCF.Shared.DebtPrincipalPaid;
            newCF.FuelCost = AnnualFeedstockCost;
            newCF.Shared.NonFuelExpenses = OperatingExpenses;
            newCF.Shared.DebtReserve = DebtReserve;
        } else {
            newCF.Shared.DebtPrincipalRemaining = CF.Shared.DebtPrincipalRemaining - newCF.Shared.DebtPrincipalPaid;
            newCF.FuelCost = AnnualFeedstockCost * Math.pow(1 + input.EscalationFeedstock / 100, Year - 1);
            newCF.Shared.NonFuelExpenses = OperatingExpenses * Math.pow(1 + input.EscalationOther / 100, Year - 1);
            if (Year === input.EconomicLife) { // last year
                newCF.Shared.DebtReserve = -DebtReserve;
            } else {
                newCF.Shared.DebtReserve = 0;
            }
        }
        newCF.Expenses = newCF.FuelCost + newCF.Shared.NonFuelExpenses;
        newCF.Shared.Depreciation = AmountOfCapitalFinancing * DepreciationFraction;
        if (Year === 1) {
            newCF.IncomeElectricalEnergy = input.ElectricalEnergy;
            newCF.IncomeIncentivePayments = input.IncentivePayments;
            newCF.Shared.IncomeCapacity = input.Capacity;
            newCF.IncomeHeat = input.Heat;
            newCF.IncomeResidue = input.Residues;
        } else {
            newCF.IncomeElectricalEnergy
                = input.ElectricalEnergy * Math.pow(1 + input.EscalationElectricalEnergy / 100, Year - 1);
            newCF.IncomeIncentivePayments
                = input.IncentivePayments * Math.pow(1 + input.EscalationIncentivePayments / 100, Year - 1);
            newCF.Shared.IncomeCapacity
                = input.Capacity * Math.pow(1 + input.EscalationCapacityPayment / 100, Year - 1);
            newCF.IncomeHeat
                = input.Heat * Math.pow(1 + input.EscalationHeatSales / 100, Year - 1);
            newCF.IncomeResidue
                = input.Residues * Math.pow(1 + input.EscalationResidueSales / 100, Year - 1);
        }
        newCF.Shared.InterestOnDebtReserve = AnnualDebtReserveInterest;
        newCF.Shared.TaxesWoCredit = ((CombinedTaxRate / 100) / (1 - CombinedTaxRate / 100))
            * (newCF.Shared.EquityPrincipalPaid + newCF.Shared.DebtPrincipalPaid + newCF.Shared.EquityInterest
                - newCF.Shared.Depreciation + newCF.Shared.DebtReserve);
        if (Year === 1) {
            newCF.Shared.TaxCredit = AnnualHydrogenEnergy * input.ProductionTaxCredit * input.TaxCreditFrac[0];
        } else {
            newCF.Shared.TaxCredit = AnnualHydrogenEnergy * input.ProductionTaxCredit
                * Math.pow((1 + input.EscalationProductionTaxCredit / 100), (Year - 1)) * input.TaxCreditFrac[Year - 1];
        }
        newCF.Shared.Taxes = (newCF.Shared.TaxesWoCredit - newCF.Shared.TaxCredit) < 0 ?
        (input.OneYearDebtReserveRequired ?
            ((CombinedTaxRate / 100) / (1 - (CombinedTaxRate / 100)))
            * (newCF.Shared.EquityPrincipalPaid + newCF.Shared.DebtPrincipalPaid + newCF.Shared.EquityInterest
                - newCF.Shared.Depreciation + newCF.Shared.DebtReserve - newCF.Shared.TaxCredit) : 0)
            : ((CombinedTaxRate / 100) / (1 - (CombinedTaxRate / 100)))
            * (newCF.Shared.EquityPrincipalPaid + newCF.Shared.DebtPrincipalPaid + newCF.Shared.EquityInterest
                - newCF.Shared.Depreciation + newCF.Shared.DebtReserve - newCF.Shared.TaxCredit);
        newCF.Shared.EnergyRevenueRequired = newCF.Shared.EquityRecovery + newCF.Shared.DebtRecovery
            + newCF.FuelCost + newCF.Shared.NonFuelExpenses + newCF.Shared.Taxes + newCF.Shared.DebtReserve
            - newCF.IncomeElectricalEnergy - newCF.IncomeIncentivePayments - newCF.Shared.IncomeCapacity
            - newCF.IncomeHeat - newCF.IncomeResidue - newCF.Shared.InterestOnDebtReserve;

        return newCF;
    }

    const Total: TotalCashFlowHydrogen
    = { Shared:
        { EquityRecovery: 0, EquityInterest: 0, EquityPrincipalPaid: 0, DebtRecovery: 0, DebtInterest: 0,
          DebtPrincipalPaid: 0, NonFuelExpenses: 0, DebtReserve: 0, Depreciation: 0, IncomeCapacity: 0,
          InterestOnDebtReserve: 0, TaxesWoCredit: 0, TaxCredit: 0, Taxes: 0, EnergyRevenueRequired: 0 },
        FuelCost: 0, Expenses: 0, IncomeElectricalEnergy: 0, IncomeIncentivePayments: 0, IncomeHeat: 0,
        IncomeResidue: 0 };
    for (let i = 0; i < cashFlow.length; i++) {
        Total.Shared.EquityRecovery += cashFlow[i].Shared.EquityRecovery;
        Total.Shared.EquityInterest += cashFlow[i].Shared.EquityInterest;
        Total.Shared.EquityPrincipalPaid += cashFlow[i].Shared.EquityPrincipalPaid;
        Total.Shared.DebtRecovery += cashFlow[i].Shared.DebtRecovery;
        Total.Shared.DebtInterest += cashFlow[i].Shared.DebtInterest;
        Total.Shared.DebtPrincipalPaid += cashFlow[i].Shared.DebtPrincipalPaid;
        Total.FuelCost += cashFlow[i].FuelCost;
        Total.Shared.NonFuelExpenses += cashFlow[i].Shared.NonFuelExpenses;
        Total.Expenses += cashFlow[i].Expenses;
        Total.Shared.DebtReserve += cashFlow[i].Shared.DebtReserve;
        Total.Shared.Depreciation += cashFlow[i].Shared.Depreciation;
        Total.IncomeElectricalEnergy += cashFlow[i].IncomeElectricalEnergy;
        Total.IncomeIncentivePayments += cashFlow[i].IncomeIncentivePayments;
        Total.Shared.IncomeCapacity += cashFlow[i].Shared.IncomeCapacity;
        Total.IncomeHeat += cashFlow[i].IncomeHeat;
        Total.IncomeResidue += cashFlow[i].IncomeResidue;
        Total.Shared.InterestOnDebtReserve += cashFlow[i].Shared.InterestOnDebtReserve;
        Total.Shared.TaxesWoCredit += cashFlow[i].Shared.TaxesWoCredit;
        Total.Shared.TaxCredit += cashFlow[i].Shared.TaxCredit;
        Total.Shared.Taxes += cashFlow[i].Shared.Taxes;
        Total.Shared.EnergyRevenueRequired += cashFlow[i].Shared.EnergyRevenueRequired;
    }
    // Current $ Level Annual Cost (LAC)
    const PresentWorth = [];
    let TotalPresentWorth = 0;
    for (let i = 0; i < cashFlow.length; i++) {
        const newPW = PW(cashFlow[i].Shared.EnergyRevenueRequired, input.MARR, i + 1);
        PresentWorth.push(newPW);
        TotalPresentWorth += newPW;
    }
    function PW(EnergyRevenueRequired: number, CostOfEquity: number, Year: number) {
        return EnergyRevenueRequired * Math.pow((1 + CostOfEquity / 100), -Year);
    }
    const CapitalRecoveryFactorCurrent = CapitalRecoveryFactorEquity;
    const CapitalRecoveryFactorConstant = CapitalRecoveryFactorEquityConstant;
    const CurrentLevelAnnualRevenueRequirements = TotalPresentWorth * CapitalRecoveryFactorEquity;
    const ConstantLevelAnnualRevenueRequirements = TotalPresentWorth * CapitalRecoveryFactorEquityConstant;
    const CurrentLACofEnergy = CurrentLevelAnnualRevenueRequirements / AnnualHydrogenProductionKg;
    const ConstantLACofEnergy = ConstantLevelAnnualRevenueRequirements / AnnualHydrogenProductionKg;
    const HydrogenGeneration: HydrogenGenerationMod
    = { HydrogenEnergy: HydrogenEnergy, DesignHydrogenProductionRateMW: DesignHydrogenProductionRateMW,
        DesignHydrogenProductionRateMg: DesignHydrogenProductionRateMg, FeedstockInput: FeedstockInput,
        FeedstockSupply: FeedstockSupply, AnnualHours: AnnualHours, AnnualFeedstockSupply: AnnualFeedstockSupply,
        AnnualFeedstockEnergyInput: AnnualFeedstockEnergyInput, AnnualHydrogenProductionMg: AnnualHydrogenProductionMg,
        AnnualHydrogenProductionKg: AnnualHydrogenProductionKg, AnnualHydrogenEnergy: AnnualHydrogenEnergy };
    const ExpensesBaseYear: ExpensesBaseYearModHydrogen
    = { AnnualFeedstockCost: AnnualFeedstockCost, OperatingExpenses: OperatingExpenses,
        TotalAnnualExpenses: TotalAnnualExpenses };
    const Financing: FinancingMod
    = { EquityRatio: 0, CostOfMoney: 0, TotalCostOfPlant: 0, TotalEquityCost: 0, TotalDebtCost: 0,
        CapitalRecoveryFactorEquity: 0, CapitalRecoveryFactorDebt: 0, AnnualEquityRecovery: 0, AnnualDebtPayment: 0,
        DebtReserve: 0 };
    Financing.EquityRatio = EquityRatio;
    Financing.CostOfMoney = WeightedCostOfMoney;
    Financing.TotalCostOfPlant = AmountOfCapitalFinancing;
    Financing.TotalEquityCost = TotalEquityPrincipal;
    Financing.TotalDebtCost = TotalDebtPrincipal;
    Financing.CapitalRecoveryFactorEquity = CapitalRecoveryFactorEquity;
    Financing.CapitalRecoveryFactorDebt = CapitalRecoveryFactorDebt;
    Financing.AnnualEquityRecovery = AnnualEquityRepayment;
    Financing.AnnualDebtPayment = AnnualDebtRepayment;
    Financing.DebtReserve = DebtReserve;
    const CurrentLevelAnnualCost: CurrentLevelAnnualCostMod
    = { CostOfMoney: 0, PresentWorth: [], TotalPresentWorth: 0, CapitalRecoveryFactorCurrent: 0,
        CurrentLevelAnnualRevenueRequirements: 0, CurrentLACofEnergy: 0 };
    CurrentLevelAnnualCost.CostOfMoney = input.MARR / 100;
    CurrentLevelAnnualCost.PresentWorth = PresentWorth;
    CurrentLevelAnnualCost.TotalPresentWorth = TotalPresentWorth;
    CurrentLevelAnnualCost.CapitalRecoveryFactorCurrent = CapitalRecoveryFactorCurrent;
    CurrentLevelAnnualCost.CurrentLevelAnnualRevenueRequirements = CurrentLevelAnnualRevenueRequirements;
    CurrentLevelAnnualCost.CurrentLACofEnergy = CurrentLACofEnergy;
    const ConstantLevelAnnualCost: ConstantLevelAnnualCostMod
    = { RealCostOfMoney: 0, CapitalRecoveryFactorConstant: 0, ConstantLevelAnnualRevenueRequirements: 0,
        ConstantLACofEnergy: 0 };
    ConstantLevelAnnualCost.RealCostOfMoney = RealCostOfEquityConstant / 100;
    ConstantLevelAnnualCost.CapitalRecoveryFactorConstant = CapitalRecoveryFactorConstant;
    ConstantLevelAnnualCost.ConstantLevelAnnualRevenueRequirements = ConstantLevelAnnualRevenueRequirements;
    ConstantLevelAnnualCost.ConstantLACofEnergy = ConstantLACofEnergy;
    const SensitivityAnalysis: SensitivityAnalysisMod
    = { LACcurrent: CurrentLACofEnergy, LACconstant: ConstantLACofEnergy };

    const Output: OutputModHydrogen
    = { Shared:
        { SensitivityAnalysis: SensitivityAnalysis, CombinedTaxRate: CombinedTaxRate,
          Financing: Financing, CurrentLAC: CurrentLevelAnnualCost, ConstantLAC: ConstantLevelAnnualCost },
        HydrogenGeneration: HydrogenGeneration, ExpensesBaseYear: ExpensesBaseYear,
        AnnualCashFlows: cashFlow, TotalCashFlow: Total
    };

    return Output;
}

export { Hydrogen };
