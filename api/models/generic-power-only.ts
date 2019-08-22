import { GenericPowerOnlyInputMod } from './input.model';
import { CashFlowGPO, ConstantLevelAnnualCostMod, CurrentLevelAnnualCostMod, ElectricalFuelBaseYearMod,
    ExpensesBaseYearModGPO, FinancingMod, IncomeOtherThanEnergyMod, SensitivityAnalysisMod,
    TotalCashFlowGPO } from './output.model';

function GenericPowerOnly(input: GenericPowerOnlyInputMod) {
    // Electrical and Fuel--base year
    const AnnualHours = input.CapacityFactor / 100 * 8760;
    const FuelConsumptionRate = input.NetElectricalCapacity / (input.NetStationEfficiency / 100) * 3600
        / input.FuelHeatingValue / 1000;
    const AnnualGeneration = input.NetElectricalCapacity * 8760 * input.CapacityFactor / 100;
    const CapitalCostNEC = input.CapitalCost / input.NetElectricalCapacity;
    const AnnualFuelConsumption = FuelConsumptionRate * AnnualHours;
    const AnnualAshDisposal = AnnualFuelConsumption * input.FuelAshConcentration / 100;
    // Expenses--base year
    const TotalNonFuelExpenses = input.LaborCost + input.MaintenanceCost + input.InsurancePropertyTax + input.Utilities
        + input.AshDisposal + input.Management + input.OtherOperatingExpenses;
    const TotalExpensesIncludingFuel = input.FuelCost * AnnualFuelConsumption + TotalNonFuelExpenses;
    const FuelCostKwh = CalcKwh(AnnualFuelConsumption * input.FuelCost);
    const LaborCostKwh = CalcKwh(input.LaborCost);
    const MaintenanceCostKwh = CalcKwh(input.MaintenanceCost);
    const InsurancePropertyTaxKwh = CalcKwh(input.InsurancePropertyTax);
    const UtilitiesKwh = CalcKwh(input.Utilities);
    const AshDisposalKwh = CalcKwh(input.AshDisposal);
    const ManagementKwh = CalcKwh(input.Management);
    const OtherOperatingExpensesKwh = CalcKwh(input.OtherOperatingExpenses);
    const TotalNonFuelExpensesKwh = LaborCostKwh + MaintenanceCostKwh + InsurancePropertyTaxKwh
        + UtilitiesKwh + AshDisposalKwh + ManagementKwh + OtherOperatingExpensesKwh;
    const TotalExpensesIncludingFuelKwh = FuelCostKwh + TotalNonFuelExpensesKwh;
    function CalcKwh(cost: number) {
        return cost / AnnualGeneration;
    }
    // Taxes
    const CombinedTaxRate = input.StateTaxRate + input.FederalTaxRate * (1 - input.StateTaxRate / 100);
    // Financing
    const EquityRatio = 100 - input.DebtRatio;
    const CostOfMoney = input.DebtRatio / 100 * input.InterestRateOnDebt + EquityRatio / 100 * input.CostOfEquity;
    const TotalCostOfPlant = input.CapitalCost;
    const TotalEquityCost = TotalCostOfPlant * EquityRatio / 100;
    const TotalDebtCost = TotalCostOfPlant * input.DebtRatio / 100;
    const CapitalRecoveryFactorEquity = CapitalRecoveryFactor(input.CostOfEquity, input.EconomicLife);
    const CapitalRecoveryFactorDebt = CapitalRecoveryFactor(input.InterestRateOnDebt, input.EconomicLife);
    const AnnualEquityRecovery = CapitalRecoveryFactorEquity * TotalEquityCost;
    const AnnualDebtPayment = TotalDebtCost * CapitalRecoveryFactorDebt;
    const DebtReserve = AnnualDebtPayment;
    function CapitalRecoveryFactor(i: number, N: number) {
        const A = i / 100 * Math.pow((1 + i / 100), N) / (Math.pow((1 + i / 100), N) - 1);
        return A;
    }
    // Income other than energy
    const AnnualCapacityPayment = input.CapacityPayment * input.NetElectricalCapacity;
    const AnnualDebtReserveInterest = DebtReserve * input.InterestRateonDebtReserve / 100;
    // Depreciation Schedule
    const DepreciationFraction = 1 / input.EconomicLife;
    // Annual Cash Flows
    const cashFlow = [];
    for (let i = 0; i < input.EconomicLife; i++) {
        const newCF: CashFlowGPO
        = { Shared:
            {Year: 0, EquityRecovery: 0, EquityInterest: 0, EquityPrincipalPaid: 0, EquityPrincipalRemaining: 0,
             DebtRecovery: 0, DebtInterest: 0, DebtPrincipalPaid: 0, DebtPrincipalRemaining: 0, NonFuelExpenses: 0,
             DebtReserve: 0, Depreciation: 0, IncomeCapacity: 0, InterestOnDebtReserve: 0, TaxesWoCredit: 0,
             TaxCredit: 0, Taxes: 0, EnergyRevenueRequired: 0 },
            FuelCost : 0 };
        cashFlow.push(newCF);
    }
    for (let i = 0; i < input.EconomicLife; i++) {
        cashFlow[i] = CalcCashFlow(cashFlow[i - 1], i + 1);
    }
    function CalcCashFlow(CF: CashFlowGPO, Year: number) {
        const newCF: CashFlowGPO
        = { Shared:
            {Year: 0, EquityRecovery: 0, EquityInterest: 0, EquityPrincipalPaid: 0, EquityPrincipalRemaining: 0,
             DebtRecovery: 0, DebtInterest: 0, DebtPrincipalPaid: 0, DebtPrincipalRemaining: 0, NonFuelExpenses: 0,
             DebtReserve: 0, Depreciation: 0, IncomeCapacity: 0, InterestOnDebtReserve: 0, TaxesWoCredit: 0,
             TaxCredit: 0, Taxes: 0, EnergyRevenueRequired: 0 },
            FuelCost: 0 };
        newCF.Shared.Year = Year;
        newCF.Shared.EquityRecovery = AnnualEquityRecovery;
        if (Year === 1) {
            newCF.Shared.EquityInterest = input.CostOfEquity / 100 * TotalEquityCost;
        } else {
            newCF.Shared.EquityInterest = input.CostOfEquity / 100 * CF.Shared.EquityPrincipalRemaining;
        }
        newCF.Shared.EquityPrincipalPaid = newCF.Shared.EquityRecovery - newCF.Shared.EquityInterest;
        if (Year === 1) {
            newCF.Shared.EquityPrincipalRemaining = TotalEquityCost - newCF.Shared.EquityPrincipalPaid;
        } else {
            newCF.Shared.EquityPrincipalRemaining
            = CF.Shared.EquityPrincipalRemaining - newCF.Shared.EquityPrincipalPaid;
        }
        newCF.Shared.DebtRecovery = AnnualDebtPayment;
        if (Year === 1) {
            newCF.Shared.DebtInterest = input.InterestRateOnDebt / 100 * TotalDebtCost;
        } else {
            newCF.Shared.DebtInterest = input.InterestRateOnDebt / 100 * CF.Shared.DebtPrincipalRemaining;
        }
        newCF.Shared.DebtPrincipalPaid = newCF.Shared.DebtRecovery - newCF.Shared.DebtInterest;
        if (Year === 1) {
            newCF.Shared.DebtPrincipalRemaining = TotalDebtCost - newCF.Shared.DebtPrincipalPaid;
        } else {
            newCF.Shared.DebtPrincipalRemaining = CF.Shared.DebtPrincipalRemaining - newCF.Shared.DebtPrincipalPaid;
        }
        newCF.FuelCost = AnnualFuelConsumption * input.FuelCost
            * Math.pow((1 + input.EscalationFuel / 100), (Year - 1));
        newCF.Shared.NonFuelExpenses = TotalNonFuelExpenses * Math.pow((1 + input.EscalationOther / 100), (Year - 1));
        if (Year === 1) {
            newCF.Shared.DebtReserve = DebtReserve;
        } else if (Year < input.EconomicLife) {
            newCF.Shared.DebtReserve = 0;
        } else {
            newCF.Shared.DebtReserve = -DebtReserve;
        }
        newCF.Shared.Depreciation = TotalCostOfPlant * DepreciationFraction;
        newCF.Shared.IncomeCapacity = AnnualCapacityPayment;
        newCF.Shared.InterestOnDebtReserve = AnnualDebtReserveInterest;
        newCF.Shared.TaxesWoCredit = ((CombinedTaxRate / 100) / (1 - CombinedTaxRate / 100))
            * (newCF.Shared.EquityPrincipalPaid + newCF.Shared.DebtPrincipalPaid + newCF.Shared.EquityInterest
                - newCF.Shared.Depreciation + newCF.Shared.DebtReserve);
        newCF.Shared.TaxCredit = AnnualGeneration * input.ProductionTaxCredit
            * Math.pow((1 + input.EscalationProductionTaxCredit / 100), (Year - 1)) * input.TaxCreditFrac[Year - 1];
        newCF.Shared.Taxes = ((CombinedTaxRate / 100) / (1 - CombinedTaxRate / 100))
            * (newCF.Shared.EquityPrincipalPaid + newCF.Shared.DebtPrincipalPaid + newCF.Shared.EquityInterest
                - newCF.Shared.Depreciation + newCF.Shared.DebtReserve - newCF.Shared.TaxCredit);
        newCF.Shared.EnergyRevenueRequired = newCF.Shared.EquityRecovery + newCF.Shared.DebtRecovery + newCF.FuelCost
            + newCF.Shared.NonFuelExpenses + newCF.Shared.Taxes + newCF.Shared.DebtReserve - newCF.Shared.IncomeCapacity
            - newCF.Shared.InterestOnDebtReserve;

        return newCF;
    }

    const Total: TotalCashFlowGPO
    = { Shared:
        { EquityRecovery: 0, EquityInterest: 0, EquityPrincipalPaid: 0, DebtRecovery: 0, DebtInterest: 0,
          DebtPrincipalPaid: 0, NonFuelExpenses: 0, DebtReserve: 0, Depreciation: 0, IncomeCapacity: 0,
          InterestOnDebtReserve: 0, TaxesWoCredit: 0, TaxCredit: 0, Taxes: 0, EnergyRevenueRequired: 0 },
        FuelCost: 0 };
    for (let i = 0; i < cashFlow.length; i++) {
        Total.Shared.EquityRecovery += cashFlow[i].Shared.EquityRecovery;
        Total.Shared.EquityInterest += cashFlow[i].Shared.EquityInterest;
        Total.Shared.EquityPrincipalPaid += cashFlow[i].Shared.EquityPrincipalPaid;
        Total.Shared.DebtRecovery += cashFlow[i].Shared.DebtRecovery;
        Total.Shared.DebtInterest += cashFlow[i].Shared.DebtInterest;
        Total.Shared.DebtPrincipalPaid += cashFlow[i].Shared.DebtPrincipalPaid;
        Total.FuelCost += cashFlow[i].FuelCost;
        Total.Shared.NonFuelExpenses += cashFlow[i].Shared.NonFuelExpenses;
        Total.Shared.DebtReserve += cashFlow[i].Shared.DebtReserve;
        Total.Shared.Depreciation += cashFlow[i].Shared.Depreciation;
        Total.Shared.IncomeCapacity += cashFlow[i].Shared.IncomeCapacity;
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
        const newPW = PW(cashFlow[i].Shared.EnergyRevenueRequired, input.CostOfEquity, i + 1);
        PresentWorth.push(newPW);
        TotalPresentWorth += newPW;
    }
    const CapitalRecoveryFactorCurrent = CapitalRecoveryFactorEquity;
    const CurrentLevelAnnualRevenueRequirements = CapitalRecoveryFactorCurrent * TotalPresentWorth;
    const CurrentLACofEnergy = CurrentLevelAnnualRevenueRequirements / AnnualGeneration;
    function PW(EnergyRevenueRequired: number, CostOfEquity: number, Year: number) {
        return EnergyRevenueRequired * Math.pow((1 + CostOfEquity / 100), -Year);
    }
    const RealCostOfMoney = (1 + input.CostOfEquity / 100) / (1 + input.GeneralInflation / 100) - 1;
    const CapitalRecoveryFactorConstant = CapitalRecoveryFactor(RealCostOfMoney * 100, input.EconomicLife);
    const ConstantLevelAnnualRevenueRequirements = TotalPresentWorth * CapitalRecoveryFactorConstant;
    const ConstantLACofEnergy = ConstantLevelAnnualRevenueRequirements / AnnualGeneration;

    const ElectricalFuelBaseYear: ElectricalFuelBaseYearMod
    = { AnnualHours: 0, FuelConsumptionRate: 0, AnnualGeneration: 0, CapitalCostNEC: 0,
        AnnualFuelConsumption: 0, AnnualAshDisposal: 0 };
    ElectricalFuelBaseYear.AnnualHours = AnnualHours;
    ElectricalFuelBaseYear.FuelConsumptionRate = FuelConsumptionRate;
    ElectricalFuelBaseYear.AnnualGeneration = AnnualGeneration;
    ElectricalFuelBaseYear.CapitalCostNEC = CapitalCostNEC;
    ElectricalFuelBaseYear.AnnualFuelConsumption = AnnualFuelConsumption;
    ElectricalFuelBaseYear.AnnualAshDisposal = AnnualAshDisposal;
    const ExpensesBaseYear: ExpensesBaseYearModGPO
    = { Shared: {
        TotalNonFuelExpenses: 0, TotalExpensesIncludingFuel: 0, LaborCostKwh: 0, MaintenanceCostKwh: 0,
        InsurancePropertyTaxKwh: 0, UtilitiesKwh: 0, ManagementKwh: 0, OtherOperatingExpensesKwh: 0,
        TotalNonFuelExpensesKwh: 0, TotalExpensesIncludingFuelKwh: 0},
        FuelCostKwh: 0, AshDisposalKwh: 0};
    ExpensesBaseYear.Shared.TotalNonFuelExpenses = TotalNonFuelExpenses;
    ExpensesBaseYear.Shared.TotalExpensesIncludingFuel = TotalExpensesIncludingFuel;
    ExpensesBaseYear.FuelCostKwh = FuelCostKwh;
    ExpensesBaseYear.Shared.LaborCostKwh = LaborCostKwh;
    ExpensesBaseYear.Shared.MaintenanceCostKwh = MaintenanceCostKwh;
    ExpensesBaseYear.Shared.InsurancePropertyTaxKwh = InsurancePropertyTaxKwh;
    ExpensesBaseYear.Shared.UtilitiesKwh = UtilitiesKwh;
    ExpensesBaseYear.AshDisposalKwh = AshDisposalKwh;
    ExpensesBaseYear.Shared.ManagementKwh = ManagementKwh;
    ExpensesBaseYear.Shared.OtherOperatingExpensesKwh = OtherOperatingExpensesKwh;
    ExpensesBaseYear.Shared.TotalNonFuelExpensesKwh = TotalNonFuelExpensesKwh;
    ExpensesBaseYear.Shared.TotalExpensesIncludingFuelKwh = TotalExpensesIncludingFuelKwh;
    const IncomeOtherThanEnergy: IncomeOtherThanEnergyMod
    = { AnnualCapacityPayment: 0, AnnualDebtReserveInterest: 0 };
    IncomeOtherThanEnergy.AnnualCapacityPayment = AnnualCapacityPayment;
    IncomeOtherThanEnergy.AnnualDebtReserveInterest = AnnualDebtReserveInterest;
    const Financing: FinancingMod
    = { EquityRatio: 0, CostOfMoney: 0, TotalCostOfPlant: 0, TotalEquityCost: 0, TotalDebtCost: 0,
        CapitalRecoveryFactorEquity: 0, CapitalRecoveryFactorDebt: 0, AnnualEquityRecovery: 0, AnnualDebtPayment: 0,
        DebtReserve: 0 };
    Financing.EquityRatio = EquityRatio;
    Financing.CostOfMoney = CostOfMoney;
    Financing.TotalCostOfPlant = TotalCostOfPlant;
    Financing.TotalEquityCost = TotalEquityCost;
    Financing.TotalDebtCost = TotalDebtCost;
    Financing.CapitalRecoveryFactorEquity = CapitalRecoveryFactorEquity;
    Financing.CapitalRecoveryFactorDebt = CapitalRecoveryFactorDebt;
    Financing.AnnualEquityRecovery = AnnualEquityRecovery;
    Financing.AnnualDebtPayment = AnnualDebtPayment;
    Financing.DebtReserve = DebtReserve;
    const CurrentLevelAnnualCost: CurrentLevelAnnualCostMod
    = { 'CostOfMoney': 0, 'PresentWorth': [], 'TotalPresentWorth': 0, 'CapitalRecoveryFactorCurrent': 0,
        'CurrentLevelAnnualRevenueRequirements': 0, 'CurrentLACofEnergy': 0 };
    CurrentLevelAnnualCost.CostOfMoney = input.CostOfEquity / 100;
    CurrentLevelAnnualCost.PresentWorth = PresentWorth;
    CurrentLevelAnnualCost.TotalPresentWorth = TotalPresentWorth;
    CurrentLevelAnnualCost.CapitalRecoveryFactorCurrent = CapitalRecoveryFactorCurrent;
    CurrentLevelAnnualCost.CurrentLevelAnnualRevenueRequirements = CurrentLevelAnnualRevenueRequirements;
    CurrentLevelAnnualCost.CurrentLACofEnergy = CurrentLACofEnergy;
    const ConstantLevelAnnualCost: ConstantLevelAnnualCostMod
    = { 'RealCostOfMoney': 0, 'CapitalRecoveryFactorConstant': 0, 'ConstantLevelAnnualRevenueRequirements': 0,
        'ConstantLACofEnergy': 0 };
    ConstantLevelAnnualCost.RealCostOfMoney = RealCostOfMoney;
    ConstantLevelAnnualCost.CapitalRecoveryFactorConstant = CapitalRecoveryFactorConstant;
    ConstantLevelAnnualCost.ConstantLevelAnnualRevenueRequirements = ConstantLevelAnnualRevenueRequirements;
    ConstantLevelAnnualCost.ConstantLACofEnergy = ConstantLACofEnergy;
    const SensitivityAnalysis: SensitivityAnalysisMod
    = { LACcurrent: CurrentLACofEnergy, LACconstant: ConstantLACofEnergy };

    return {
        'Sensitivity Analysis': SensitivityAnalysis,
        'Electrical and Fuel--base year': ElectricalFuelBaseYear,
        'Expenses--base year': ExpensesBaseYear,
        'Combined Tax Rate (%)': CombinedTaxRate,
        'Income other than energy': IncomeOtherThanEnergy,
        'Financing': Financing,
        'AnnualCashFlows': cashFlow,
        'TotalCashFlow': Total,
        'Current $ Level Annual Cost (LAC)': CurrentLevelAnnualCost,
        'Constant $ Level Annual Cost (LAC)': ConstantLevelAnnualCost
    };
}

export { GenericPowerOnly };
