import { InputModGP } from './input.model';
import { CapitalCostMod, CashFlowGP, ConstantLevelAnnualCostMod, CurrentLevelAnnualCostMod,
    ElectricalFuelBaseYearModGP, ExpensesBaseYearModGP, FinancingMod, HeatBaseYearMod,
    IncomeOtherThanEnergyModGP, OutputModGP, SensitivityAnalysisMod, TotalCashFlowGP } from './output.model';
function GasificationPower(input: InputModGP) {
     // Fuel Properties
    const CODensity = 101325 * 28 / 8314 / 298;
    const H2Density = 101325 * 2 / 8314 / 298;
    const CH4Density = 101325 * 16 / 8314 / 298;
    const HeavyDieselHigherHeatingKjPerL = input.HeavyDieselHigherHeatingMjPerKg * input.HeavyDieselDensity;
    const COHHeating = input.COHigherHeatingMjPerKg * CODensity * 1000;
    const COLHeating = input.COLowerHeatingMjPerKg * CODensity * 1000;
    const H2HiHeating = input.H2HigherHeatingMjPerKg * H2Density * 1000;
    const H2LHeating = input.H2LowerHeatingMjPerKg * H2Density * 1000;
    const CH4HHeating = input.CH4HigherHeatingMjPerKg * CH4Density * 1000;
    const CH4LHeating = input.CH4LowerHeatingMjPerKg * CH4Density * 1000;
    // Capital Cost
    const CapitalCost: CapitalCostMod
    = { TotalFacilityCapitalCost: 0, GasifierSystemCapitalCostPerKwe: 0, GasCleaningSystemCapitalCostPerKwe: 0,
        PowerGenerationCapitalCostPerKwe: 0, EmissionControlSystemCapitalCostPerKwe: 0,
        HeatRecoverySystemCapitalCostPerKwe: 0, TotalFacilityCapitalCostPerKwe: 0 };
    CapitalCost.GasifierSystemCapitalCostPerKwe = input.GasifierSystemCapitalCost / input.NetElectricalCapacity;
    CapitalCost.GasCleaningSystemCapitalCostPerKwe = input.GasCleaningSystemCapitalCost / input.NetElectricalCapacity;
    CapitalCost.PowerGenerationCapitalCostPerKwe = input.PowerGenerationCapitalCost / input.NetElectricalCapacity;
    CapitalCost.EmissionControlSystemCapitalCostPerKwe
    = input.EmissionControlSystemCapitalCost / input.NetElectricalCapacity;
    CapitalCost.HeatRecoverySystemCapitalCostPerKwe = input.HeatRecoverySystemCapitalCost / input.NetElectricalCapacity;
    CapitalCost.TotalFacilityCapitalCost = input.GasifierSystemCapitalCost + input.GasCleaningSystemCapitalCost +
        input.PowerGenerationCapitalCost + input.EmissionControlSystemCapitalCost + input.HeatRecoverySystemCapitalCost;
    CapitalCost.TotalFacilityCapitalCostPerKwe = CapitalCost.TotalFacilityCapitalCost / input.NetElectricalCapacity;
    // Electrical and Fuel--base year
    const ParasiticLoad = input.GrossElectricalCapacity - input.NetElectricalCapacity;
    const AnnualHours = input.CapacityFactor / 100 * 8760;
    const AnnualNetElectricityGeneration = input.NetElectricalCapacity * AnnualHours;
    const OverallNetSystemEfficiency = input.HHVEfficiency * input.NetHHVEfficiency / 100;
    const N2 = 100 - (input.CO + input.H2 + input.Hydrocarbons + input.CO2 + input.O2);
    const CleanGasMolecularMass = (input.CO * 28 + input.H2 * 2 + input.Hydrocarbons * 16 + input.CO2 * 44 + input.O2 *
        32 + N2 * 28) / 100;
    const CleanGasDensity = 101325 * CleanGasMolecularMass / 8314 / 298;
    const CleanGasHHeating = (input.CO * COHHeating + input.H2 * H2HiHeating + input.Hydrocarbons * CH4HHeating) / 100;
    const CleanGasLHeating = (input.CO * COLHeating + input.H2 * H2LHeating + input.Hydrocarbons * CH4LHeating) / 100;
    const TotalFuelPowerInput = input.NetElectricalCapacity / (input.NetHHVEfficiency / 100);
    const CleanGasPowerInput = TotalFuelPowerInput * (1 - input.FractionOfInputEnergy / 100);
    const DualFuelPowerInput = TotalFuelPowerInput * input.FractionOfInputEnergy / 100;
    const CleanGasFlowRateVolume = CleanGasPowerInput / CleanGasHHeating * 3600;
    const CleanGasFlowRateMass = CleanGasFlowRateVolume * CleanGasDensity;
    const AnnualCleanGasConsumption = CleanGasFlowRateMass * AnnualHours / 1000;
    const DualFuelFlowRate = DualFuelPowerInput / HeavyDieselHigherHeatingKjPerL * 3600;
    const AnnualDualFuelConsumption = DualFuelFlowRate * AnnualHours;
    const BiomassFeedRate = CleanGasPowerInput / (input.HHVEfficiency / 100) / input.HigherHeating * 3600;
    const AnnualBiomassConsumptionDry = BiomassFeedRate * AnnualHours / 1000;
    const AnnualBiomassConsumptionWet = AnnualBiomassConsumptionDry / (1 - input.MoistureContent / 100);
    const CharProductionRate = input.AshContent / 100 * BiomassFeedRate / (1 - input.CarbonConcentration / 100);
    const AnnualCharProduction = CharProductionRate * AnnualHours / 1000;
    // Heat--base year
    const TotalHeatProductionRate = TotalFuelPowerInput - input.GrossElectricalCapacity;
    const RecoveredHeat = TotalHeatProductionRate * input.AggregateFractionOfHeatRecovered / 100;
    const AnnualHeatSales = RecoveredHeat * AnnualHours;
    const TotalIncomeFromHeatSales = AnnualHeatSales * input.AggregateSalesPriceForHeat;
    const HeatIncomePerUnitNEE = TotalIncomeFromHeatSales / AnnualNetElectricityGeneration;
    const OverallCHPefficiencyGross = (input.GrossElectricalCapacity * AnnualHours + AnnualHeatSales)
        / (TotalFuelPowerInput * AnnualHours) * 100;
    const  OverallCHPefficiencyNet = (AnnualNetElectricityGeneration + AnnualHeatSales)
        / (TotalFuelPowerInput * AnnualHours) * 100;
    // Expenses--base year
    const BiomassFuelCostPerKwh = AnnualBiomassConsumptionDry * input.BiomassFuelCost
        / AnnualNetElectricityGeneration;
    const DualFuelPerKwh = input.DualFuelCost * AnnualDualFuelConsumption / AnnualNetElectricityGeneration;
    const LaborCostKwh = input.LaborCost / AnnualNetElectricityGeneration;
    const MaintenanceCostKwh = input.MaintenanceCost / AnnualNetElectricityGeneration;
    const WasteTreatmentKwh = input.WasteTreatment / AnnualNetElectricityGeneration;
    const InsurancePropertyTaxKwh = input.Insurance / AnnualNetElectricityGeneration;
    const UtilitiesKwh = input.Utilities / AnnualNetElectricityGeneration;
    const ManagementKwh = input.Management / AnnualNetElectricityGeneration;
    const OtherOperatingExpensesKwh = input.OtherOperatingExpenses / AnnualNetElectricityGeneration;
    const TotalNonFuelExpenses = input.LaborCost + input.MaintenanceCost + input.WasteTreatment + input.Insurance
        + input.Utilities + input.Management + input.OtherOperatingExpenses;
    const TotalNonFuelExpensesKwh = LaborCostKwh + MaintenanceCostKwh + WasteTreatmentKwh + InsurancePropertyTaxKwh
        + UtilitiesKwh + ManagementKwh + OtherOperatingExpensesKwh;
    const TotalExpensesIncludingFuel = input.BiomassFuelCost * AnnualBiomassConsumptionDry + input.DualFuelCost
        * AnnualDualFuelConsumption + TotalNonFuelExpenses;
    const TotalExpensesIncludingFuelKwh = BiomassFuelCostPerKwh + DualFuelPerKwh + TotalNonFuelExpensesKwh;
    // Taxes
    const CombinedTaxRate = input.StateTaxRate + input.FederalTaxRate * (1 - input.StateTaxRate / 100);
    // Financing
    const EquityRatio = 100 - input.DebtRatio;
    const CostOfMoney = input.DebtRatio / 100 * input.InterestRateOnDebt + EquityRatio / 100 * input.CostOfEquity;
    const TotalCostOfPlant = CapitalCost.TotalFacilityCapitalCost;
    const TotalEquityCost = TotalCostOfPlant * EquityRatio / 100;
    const TotalDebtCost = TotalCostOfPlant * input.DebtRatio / 100;
    const CapitalRecoveryFactorEquity = input.CostOfEquity / 100 * (1 + input.CostOfEquity / 100) ** input.EconomicLife
        / ((1 + input.CostOfEquity / 100) ** input.EconomicLife - 1);
    const CapitalRecoveryFactorDebt = input.InterestRateOnDebt / 100 * (1 + input.InterestRateOnDebt / 100)
        ** input.EconomicLife / ((1 + input.InterestRateOnDebt / 100) ** input.EconomicLife - 1);
    const AnnualEquityRecovery = CapitalRecoveryFactorEquity * TotalEquityCost;
    const AnnualDebtPayment = TotalDebtCost * CapitalRecoveryFactorDebt;
    const DebtReserve = AnnualDebtPayment;
    // Income other than energy
    const AnnualCapacityPayment = input.ElectricityCapacityPayment * input.NetElectricalCapacity;
    const AnnualDebtReserveInterest = DebtReserve * input.InterestRateOnDebtReserve / 100;
    const AnnualIncomeFromChar = input.SalesPriceForChar * AnnualCharProduction;
    // Depreciation Schedule
    const DepreciationFraction = 1 / input.EconomicLife;
    // Annual Cash Flows
    const cashFlow = [];
    for (let i = 0; i < input.EconomicLife; i++) {
        const newCF: CashFlowGP
        = { Shared:
            {Year: 0, EquityRecovery: 0, EquityInterest: 0, EquityPrincipalPaid: 0, EquityPrincipalRemaining: 0,
             DebtRecovery: 0, DebtInterest: 0, DebtPrincipalPaid: 0, DebtPrincipalRemaining: 0, NonFuelExpenses: 0,
             DebtReserve: 0, Depreciation: 0, IncomeCapacity: 0, InterestOnDebtReserve: 0, TaxesWoCredit: 0,
             TaxCredit: 0, Taxes: 0, EnergyRevenueRequired: 0 },
            BiomassFuelCost: 0, DualFuelCost: 0, IncomeHeat: 0, IncomeChar: 0 };
        cashFlow.push(newCF);
    }
    for (let i = 0; i < input.EconomicLife; i++) {
        cashFlow[i] = CalcCashFlow(cashFlow[i - 1], i + 1);
    }
    function CalcCashFlow(CF: CashFlowGP, Year: number) {
        const newCF: CashFlowGP
        = { Shared:
            {Year: 0, EquityRecovery: 0, EquityInterest: 0, EquityPrincipalPaid: 0, EquityPrincipalRemaining: 0,
             DebtRecovery: 0, DebtInterest: 0, DebtPrincipalPaid: 0, DebtPrincipalRemaining: 0, NonFuelExpenses: 0,
             DebtReserve: 0, Depreciation: 0, IncomeCapacity: 0, InterestOnDebtReserve: 0, TaxesWoCredit: 0,
             TaxCredit: 0, Taxes: 0, EnergyRevenueRequired: 0 },
            BiomassFuelCost: 0, DualFuelCost: 0, IncomeHeat: 0, IncomeChar: 0 };
        newCF.Shared.Year = Year;
        newCF.Shared.EquityRecovery = AnnualEquityRecovery;
        if (Year === 1) {
            newCF.Shared.EquityInterest = input.CostOfEquity / 100 * TotalEquityCost;
        } else {
            newCF.Shared.EquityInterest = input.CostOfEquity / 100 * CF.Shared.EquityPrincipalRemaining; }
        newCF.Shared.EquityPrincipalPaid = newCF.Shared.EquityRecovery - newCF.Shared.EquityInterest;
        if (Year === 1) {
            newCF.Shared.EquityPrincipalRemaining = TotalEquityCost - newCF.Shared.EquityPrincipalPaid;
        } else {
            newCF.Shared.EquityPrincipalRemaining
            = CF.Shared.EquityPrincipalRemaining - newCF.Shared.EquityPrincipalPaid; }
        newCF.Shared.DebtRecovery = AnnualDebtPayment;
        if (Year === 1) {
            newCF.Shared.DebtInterest = input.InterestRateOnDebt / 100 * TotalDebtCost;
        } else {
            newCF.Shared.DebtInterest = input.InterestRateOnDebt / 100 * CF.Shared.DebtPrincipalRemaining; }
        newCF.Shared.DebtPrincipalPaid = newCF.Shared.DebtRecovery - newCF.Shared.DebtInterest;
        if (Year === 1) {
            newCF.Shared.DebtPrincipalRemaining = TotalDebtCost - newCF.Shared.DebtPrincipalPaid;
            newCF.BiomassFuelCost = AnnualBiomassConsumptionDry * input.BiomassFuelCost;
            newCF.DualFuelCost = AnnualDualFuelConsumption * input.DualFuelCost;
        } else {
            newCF.Shared.DebtPrincipalRemaining = CF.Shared.DebtPrincipalRemaining - newCF.Shared.DebtPrincipalPaid;
            newCF.BiomassFuelCost = CF.BiomassFuelCost * (1 + input.EscalationBiomassFuel / 100);
            newCF.DualFuelCost = CF.DualFuelCost * (1 + input.EscalationDualFuel / 100); }
        newCF.Shared.NonFuelExpenses = TotalNonFuelExpenses * Math.pow((1 + input.EscalationOther / 100), (Year - 1));
        if (Year === 1) {
            newCF.Shared.DebtReserve = DebtReserve;
        } else if (Year < input.EconomicLife) {
            newCF.Shared.DebtReserve = 0;
        } else {
            newCF.Shared.DebtReserve = -DebtReserve; }
        newCF.Shared.Depreciation = TotalCostOfPlant * DepreciationFraction;
        newCF.Shared.IncomeCapacity = AnnualCapacityPayment;
        if (Year === 1) {
            newCF.IncomeHeat = TotalIncomeFromHeatSales;
            newCF.IncomeChar = AnnualIncomeFromChar;
        } else {
            newCF.IncomeHeat = TotalIncomeFromHeatSales * Math.pow((1 + input.EscalationHeatSales / 100), (Year - 1));
            newCF.IncomeChar = CF.IncomeChar * (1 + input.EscalationCharSales / 100); }
        newCF.Shared.InterestOnDebtReserve = AnnualDebtReserveInterest;
        newCF.Shared.TaxesWoCredit = ((CombinedTaxRate / 100) / (1 - CombinedTaxRate / 100))
            * (newCF.Shared.EquityPrincipalPaid + newCF.Shared.DebtPrincipalPaid + newCF.Shared.EquityInterest
                - newCF.Shared.Depreciation + newCF.Shared.DebtReserve);
        newCF.Shared.TaxCredit = AnnualNetElectricityGeneration * input.ProductionTaxCredit
            * Math.pow((1 + input.EscalationProductionTaxCredit / 100), (Year - 1)) * input.TaxCreditFrac[Year - 1];
        newCF.Shared.Taxes = ((CombinedTaxRate / 100) / (1 - CombinedTaxRate / 100))
            * (newCF.Shared.EquityPrincipalPaid + newCF.Shared.DebtPrincipalPaid + newCF.Shared.EquityInterest
                - newCF.Shared.Depreciation + newCF.Shared.DebtReserve - newCF.Shared.TaxCredit);
        newCF.Shared.EnergyRevenueRequired = newCF.Shared.EquityRecovery + newCF.Shared.DebtRecovery
        + newCF.BiomassFuelCost + newCF.DualFuelCost + newCF.Shared.NonFuelExpenses + newCF.Shared.Taxes
        + newCF.Shared.DebtReserve - newCF.Shared.IncomeCapacity - newCF.Shared.InterestOnDebtReserve
        - newCF.IncomeHeat - newCF.IncomeChar;
        return newCF;
    }
    const Total: TotalCashFlowGP
    = { Shared:
        { EquityRecovery: 0, EquityInterest: 0, EquityPrincipalPaid: 0, DebtRecovery: 0, DebtInterest: 0,
          DebtPrincipalPaid: 0, NonFuelExpenses: 0, DebtReserve: 0, Depreciation: 0, IncomeCapacity: 0,
          InterestOnDebtReserve: 0, TaxesWoCredit: 0, TaxCredit: 0, Taxes: 0, EnergyRevenueRequired: 0 },
        BiomassFuelCost: 0, DualFuelCost: 0, IncomeHeat: 0, IncomeChar: 0 };
    for (let i = 0; i < cashFlow.length; i++) {
        Total.Shared.EquityRecovery += cashFlow[i].Shared.EquityRecovery;
        Total.Shared.EquityInterest += cashFlow[i].Shared.EquityInterest;
        Total.Shared.EquityPrincipalPaid += cashFlow[i].Shared.EquityPrincipalPaid;
        Total.Shared.DebtRecovery += cashFlow[i].Shared.DebtRecovery;
        Total.Shared.DebtInterest += cashFlow[i].Shared.DebtInterest;
        Total.Shared.DebtPrincipalPaid += cashFlow[i].Shared.DebtPrincipalPaid;
        Total.BiomassFuelCost += cashFlow[i].BiomassFuelCost;
        Total.DualFuelCost += cashFlow[i].DualFuelCost;
        Total.Shared.NonFuelExpenses += cashFlow[i].Shared.NonFuelExpenses;
        Total.Shared.DebtReserve += cashFlow[i].Shared.DebtReserve;
        Total.Shared.Depreciation += cashFlow[i].Shared.Depreciation;
        Total.Shared.IncomeCapacity += cashFlow[i].Shared.IncomeCapacity;
        Total.IncomeHeat += cashFlow[i].IncomeHeat;
        Total.IncomeChar += cashFlow[i].IncomeChar;
        Total.Shared.InterestOnDebtReserve += cashFlow[i].Shared.InterestOnDebtReserve;
        Total.Shared.TaxesWoCredit += cashFlow[i].Shared.TaxesWoCredit;
        Total.Shared.TaxCredit += cashFlow[i].Shared.TaxCredit;
        Total.Shared.Taxes += cashFlow[i].Shared.Taxes;
        Total.Shared.EnergyRevenueRequired += cashFlow[i].Shared.EnergyRevenueRequired; }
    // Current $ Level Annual Cost (LAC)
    const CurrentLevelAnnualCost: CurrentLevelAnnualCostMod
    = { CostOfMoney: 0, PresentWorth: [], TotalPresentWorth: 0, CapitalRecoveryFactorCurrent: 0,
        CurrentLevelAnnualRevenueRequirements: 0, CurrentLACofEnergy: 0 };
    CurrentLevelAnnualCost.CostOfMoney = input.CostOfEquity / 100;
    let TempPresentWorth: number;
    for (let i = 0; i < input.EconomicLife; i++) {
        TempPresentWorth
        = cashFlow[i].Shared.EnergyRevenueRequired * (1 + CurrentLevelAnnualCost.CostOfMoney)
        ** (- cashFlow[i].Shared.Year);
        CurrentLevelAnnualCost.TotalPresentWorth += TempPresentWorth;
        CurrentLevelAnnualCost.PresentWorth.push(TempPresentWorth); }
    CurrentLevelAnnualCost.CapitalRecoveryFactorCurrent
    = CurrentLevelAnnualCost.CostOfMoney * (1 + CurrentLevelAnnualCost.CostOfMoney)
        ** input.EconomicLife / ((1 + CurrentLevelAnnualCost.CostOfMoney) ** input.EconomicLife - 1);
    CurrentLevelAnnualCost.CurrentLevelAnnualRevenueRequirements = CurrentLevelAnnualCost.TotalPresentWorth
        * CurrentLevelAnnualCost.CapitalRecoveryFactorCurrent;
    CurrentLevelAnnualCost.CurrentLACofEnergy
    = CurrentLevelAnnualCost.CurrentLevelAnnualRevenueRequirements / AnnualNetElectricityGeneration;
    // Constant & Level Annual Cost (LAC)
    const ConstantLevelAnnualCost: ConstantLevelAnnualCostMod
    = { RealCostOfMoney: 0, CapitalRecoveryFactorConstant: 0, ConstantLevelAnnualRevenueRequirements: 0,
        ConstantLACofEnergy: 0 };
    ConstantLevelAnnualCost.RealCostOfMoney
    = (1 + CurrentLevelAnnualCost.CostOfMoney) / (1 + input.GeneralInflation / 100) - 1;
    ConstantLevelAnnualCost.CapitalRecoveryFactorConstant
    = ConstantLevelAnnualCost.RealCostOfMoney * (1 + ConstantLevelAnnualCost.RealCostOfMoney)
        ** input.EconomicLife / ((1 + ConstantLevelAnnualCost.RealCostOfMoney) ** input.EconomicLife - 1);
    ConstantLevelAnnualCost.ConstantLevelAnnualRevenueRequirements = CurrentLevelAnnualCost.TotalPresentWorth
        * ConstantLevelAnnualCost.CapitalRecoveryFactorConstant;
    ConstantLevelAnnualCost.ConstantLACofEnergy
    = ConstantLevelAnnualCost.ConstantLevelAnnualRevenueRequirements / AnnualNetElectricityGeneration;
    const ElectricalFuelBaseYear: ElectricalFuelBaseYearModGP
    = { ParasiticLoad: ParasiticLoad, AnnualHours: AnnualHours,
        AnnualNetElectricityGeneration: AnnualNetElectricityGeneration,
        OverallNetSystemEfficiency: OverallNetSystemEfficiency, NitrogenGas: N2,
        CleanGasMolecularMass: CleanGasMolecularMass, CleanGasDensity: CleanGasDensity,
        CleanGasHigherHeatingValue: CleanGasHHeating, CleanGasLowerHeatingValue: CleanGasLHeating,
        TotalFuelPowerInput: TotalFuelPowerInput, CleanGasPowerInput: CleanGasPowerInput,
        DualFuelPowerInput: DualFuelPowerInput, CleanGasFlowRateVolume: CleanGasFlowRateVolume,
        CleanGasFlowRateMass: CleanGasFlowRateMass, AnnualCleanGasConsumption: AnnualCleanGasConsumption,
        DualFuelFlowRate: DualFuelFlowRate, AnnualDualFuelConsumption: AnnualDualFuelConsumption,
        BiomassFeedRate: BiomassFeedRate, AnnualBiomassConsumptionDryMass: AnnualBiomassConsumptionDry,
        AnnualBiomassConsumptionWetMass: AnnualBiomassConsumptionWet, CharProductionRate: CharProductionRate,
        AnnualCharProduction: AnnualCharProduction };
    const HeatBaseYear: HeatBaseYearMod
    = { TotalHeatProductionRate: TotalHeatProductionRate, RecoveredHeat: RecoveredHeat,
        AnnualHeatSales: AnnualHeatSales, TotalIncomeFromHeatSales: TotalIncomeFromHeatSales,
        HeatIncomePerUnitNEE: HeatIncomePerUnitNEE, OverallCHPefficiencyGross: OverallCHPefficiencyGross,
        OverallCHPefficiencyNet: OverallCHPefficiencyNet };
    const ExpensesBaseYear: ExpensesBaseYearModGP
    = { Shared: {
        TotalNonFuelExpenses: TotalNonFuelExpenses, TotalExpensesIncludingFuel: TotalExpensesIncludingFuel,
        LaborCostKwh: LaborCostKwh, MaintenanceCostKwh: MaintenanceCostKwh,
        InsurancePropertyTaxKwh: InsurancePropertyTaxKwh, UtilitiesKwh: UtilitiesKwh, ManagementKwh: ManagementKwh,
        OtherOperatingExpensesKwh: OtherOperatingExpensesKwh, TotalNonFuelExpensesKwh: TotalNonFuelExpensesKwh,
        TotalExpensesIncludingFuelKwh: TotalExpensesIncludingFuelKwh},
        BiomassFuelCostKwh: BiomassFuelCostPerKwh, DualFuelCostKwh: DualFuelPerKwh,
        WasteTreatmentKwh: WasteTreatmentKwh
    };
    const IncomeOtherThanEnergy: IncomeOtherThanEnergyModGP
    = { Shared: { AnnualCapacityPayment: 0, AnnualDebtReserveInterest: 0 }, AnnualIncomeFromChar: 0 };
    IncomeOtherThanEnergy.Shared.AnnualCapacityPayment = AnnualCapacityPayment;
    IncomeOtherThanEnergy.Shared.AnnualDebtReserveInterest = AnnualDebtReserveInterest;
    IncomeOtherThanEnergy.AnnualIncomeFromChar = AnnualIncomeFromChar;
    const Financing: FinancingMod
    = { EquityRatio: EquityRatio, CostOfMoney: CostOfMoney, TotalCostOfPlant: TotalCostOfPlant,
        TotalEquityCost: TotalEquityCost, TotalDebtCost: TotalDebtCost,
        CapitalRecoveryFactorEquity: CapitalRecoveryFactorEquity, CapitalRecoveryFactorDebt: CapitalRecoveryFactorDebt,
        AnnualEquityRecovery: AnnualEquityRecovery, AnnualDebtPayment: AnnualDebtPayment, DebtReserve: DebtReserve
    };
    const SensitivityAnalysis: SensitivityAnalysisMod
    = { LACcurrent: CurrentLevelAnnualCost.CurrentLACofEnergy,
        LACconstant: ConstantLevelAnnualCost.ConstantLACofEnergy };

    const Output: OutputModGP
    = { Shared:
        { SensitivityAnalysis: SensitivityAnalysis, CombinedTaxRate: CombinedTaxRate,
          Financing: Financing, CurrentLAC: CurrentLevelAnnualCost, ConstantLAC: ConstantLevelAnnualCost },
        CapitalCost: CapitalCost, ElectricalAndFuelBaseYear: ElectricalFuelBaseYear, HeatBaseYear: HeatBaseYear,
        ExpensesBaseYear: ExpensesBaseYear, IncomeOtherThanEnergy: IncomeOtherThanEnergy,
        AnnualCashFlows: cashFlow, TotalCashFlow: Total
    };

    return Output;
}
export { GasificationPower };
