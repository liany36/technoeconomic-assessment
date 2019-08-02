import { CashFlowGas, ConstantLAC, CurrentLAC, GasificationPowerInputMod,
    TotalCashFlowGas, } from './gasification-power.model';
function GasificationPower(input: GasificationPowerInputMod) {
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
    const GasifierSystemCapitalCostPerKwe = input.GasifierSystemCapitalCost / input.NetElectricalCapacity;
    const GasCleaningSystemCapitalCostPerKwe = input.GasCleaningSystemCapitalCost / input.NetElectricalCapacity;
    const PowerGenerationCapitalCostPerKwe = input.PowerGenerationCapitalCost / input.NetElectricalCapacity;
    const EmissionControlSystemCapitalCostPerKwe = input.EmissionControlSystemCapitalCost / input.NetElectricalCapacity;
    const HeatRecoverySystemCapitalCostPerKwe = input.HeatRecoverySystemCapitalCost / input.NetElectricalCapacity;
    const TotalFacilityCapitalCost = input.GasifierSystemCapitalCost + input.GasCleaningSystemCapitalCost +
        input.PowerGenerationCapitalCost + input.EmissionControlSystemCapitalCost + input.HeatRecoverySystemCapitalCost;
    const TotalFacilityCapitalCostPerKwe = TotalFacilityCapitalCost / input.NetElectricalCapacity;
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
    const TotalHearProductionRate = TotalFuelPowerInput - input.GrossElectricalCapacity;
    const RecoveredHeat = TotalHearProductionRate * input.AggregateFractionOfHeatRecovered / 100;
    const AnnualHeatSales = RecoveredHeat * AnnualHours;
    const TotalIncomeFromHeatSales = AnnualHeatSales * input.AggregateSalesPriceForHeat;
    const HeatIncomePerUnitElecEnergy = TotalIncomeFromHeatSales / AnnualNetElectricityGeneration;
    const GrossCHPEfficiency = (input.GrossElectricalCapacity * AnnualHours + AnnualHeatSales)
        / (TotalFuelPowerInput * AnnualHours) * 100;
    const  NetCHPEfficiency = (AnnualNetElectricityGeneration + AnnualHeatSales)
        / (TotalFuelPowerInput * AnnualHours) * 100;
    // Expenses--base year
    const BiomassFuelCostPerKwh = AnnualBiomassConsumptionDry * input.BiomassFuelCost
        / AnnualNetElectricityGeneration;
    const DualFuelPerKwh = input.DualFuelCost * AnnualDualFuelConsumption / AnnualNetElectricityGeneration;
    const LaborCostPerKwh = input.LaborCost / AnnualNetElectricityGeneration;
    const MaintenanceCostPerKwh = input.MaintenanceCost / AnnualNetElectricityGeneration;
    const WasteTreatmentPerKwh = input.WasteTreatment / AnnualNetElectricityGeneration;
    const InsurancePerKwh = input.Insurance / AnnualNetElectricityGeneration;
    const UtilitiesPerKwh = input.Utilities / AnnualNetElectricityGeneration;
    const ManagementPerKwh = input.Management / AnnualNetElectricityGeneration;
    const OtherOperatingExpensesPerKwh = input.OtherOperatingExpenses / AnnualNetElectricityGeneration;
    const TotalNonFuelExpenses = input.LaborCost + input.MaintenanceCost + input.WasteTreatment + input.Insurance
        + input.Utilities + input.Management + input.OtherOperatingExpenses;
    const TotalNonFuelExpensesPerKwh = LaborCostPerKwh + MaintenanceCostPerKwh + WasteTreatmentPerKwh + InsurancePerKwh
        + UtilitiesPerKwh + ManagementPerKwh + OtherOperatingExpensesPerKwh;
    const TotalExpensesIncludingFuel = input.BiomassFuelCost * AnnualBiomassConsumptionDry + input.DualFuelCost
        * AnnualDualFuelConsumption + TotalNonFuelExpenses;
    const TotalExpensesIncludingFuelPerKwh = BiomassFuelCostPerKwh + DualFuelPerKwh + TotalNonFuelExpensesPerKwh;
    // Taxes
    const CombinedTaxRate = input.StateTaxRate + input.FederalTaxRate * (1 - input.StateTaxRate / 100);
    // Financing
    const EquityRatio = 100 - input.DebtRatio;
    const CostOfMoney = input.DebtRatio / 100 * input.InterestRateOnDebt + EquityRatio / 100 * input.CostOfEquity;
    const TotalCostOfPlant = TotalFacilityCapitalCost;
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
    const DepreciationRate = 1 / input.EconomicLife;
    // Annual Cash Flows
    const CashFlow = [];
    for (let i = 0; i < input.EconomicLife; i++) {
         const tGCF: CashFlowGas = {Year: 0, EquityRecovery: 0, EquityInterest: 0, EquityPrincipalPaid: 0,
                                    EquityPrincipalRemaining: 0, DebtRecovery: 0, DebtInterest: 0,
                                    DebtPrincipalPaid: 0, DebtPrincipalRemaining: 0, BiomassFuelCostCF: 0,
                                    DualFuelCostCF: 0, NonFuelExpensesCF: 0, DebtReserveCF: 0,
                                    Depreciation: 0, CapacityIncome: 0, HeatIncome: 0, CharIncome: 0,
                                    InterstOnDebtReserve: 0, TaxWithoutCredit: 0, TaxCredit: 0, Taxes: 0,
                                    EnergyRevenueRequired: 0};
         CashFlow.push(tGCF);
        }
    for (let i = 0; i < input.EconomicLife; i++) {
            CashFlow[i] = CalcCashFlow(CashFlow[i - 1], i + 1);
    }
    function CalcCashFlow(GCF: CashFlowGas, Year: number) {
    const NGCF: CashFlowGas = {Year: 0, EquityRecovery: 0, EquityInterest: 0, EquityPrincipalPaid: 0,
                               EquityPrincipalRemaining: 0, DebtRecovery: 0, DebtInterest: 0,
                               DebtPrincipalPaid: 0, DebtPrincipalRemaining: 0, BiomassFuelCostCF: 0,
                               DualFuelCostCF: 0, NonFuelExpensesCF: 0, DebtReserveCF: 0,
                               Depreciation: 0, CapacityIncome: 0, HeatIncome: 0, CharIncome: 0,
                               InterstOnDebtReserve: 0, TaxWithoutCredit: 0, TaxCredit: 0, Taxes: 0,
                               EnergyRevenueRequired: 0};
    NGCF.Year = Year;
    NGCF.EquityRecovery = AnnualEquityRecovery;
    if (Year === 1) {
        NGCF.EquityInterest = input.CostOfEquity / 100 * TotalEquityCost;
    } else {
            NGCF.EquityInterest = input.CostOfEquity / 100 * GCF.EquityPrincipalRemaining;
        }
    NGCF.EquityPrincipalPaid = NGCF.EquityRecovery - NGCF.EquityInterest;
    if (Year === 1) {
            NGCF.EquityPrincipalRemaining = TotalEquityCost - NGCF.EquityPrincipalPaid;
        } else {
            NGCF.EquityPrincipalRemaining = GCF.EquityPrincipalRemaining - NGCF.EquityPrincipalPaid;
        }
    NGCF.DebtRecovery = AnnualDebtPayment;
    if (Year === 1) {
            NGCF.DebtInterest = input.InterestRateOnDebt / 100 * TotalDebtCost;
        } else {
            NGCF.DebtInterest = (input.InterestRateOnDebt / 100) * GCF.DebtPrincipalRemaining;
        }
    NGCF.DebtPrincipalPaid = NGCF.DebtRecovery - NGCF.DebtInterest;
    if (Year === 1) {
            NGCF.DebtPrincipalRemaining = TotalDebtCost - NGCF.DebtPrincipalPaid;
            NGCF.BiomassFuelCostCF = AnnualBiomassConsumptionDry * input.BiomassFuelCost;
            NGCF.DualFuelCostCF = AnnualDualFuelConsumption * input.DualFuelCost;
            NGCF.NonFuelExpensesCF = TotalNonFuelExpenses;

        } else {
            NGCF.DebtPrincipalRemaining = GCF.DebtPrincipalRemaining - NGCF.DebtPrincipalPaid;
            NGCF.BiomassFuelCostCF = GCF.BiomassFuelCostCF * (1 + input.EscalationBiomassFuel / 100);
            NGCF.DualFuelCostCF = GCF.DualFuelCostCF * (1 + input.EscalationDualFuel / 100);
            NGCF.NonFuelExpensesCF = GCF.NonFuelExpensesCF * (1 + input.EscalationOther / 100);
        }
    if (Year === 1) {
            NGCF.DebtReserveCF = DebtReserve;
        } else if (Year === 20) {
            NGCF.DebtReserveCF = -DebtReserve;
        } else {
            NGCF.DebtReserveCF = 0;
        }
    NGCF.Depreciation = TotalCostOfPlant * DepreciationRate;
    NGCF.CapacityIncome = AnnualCapacityPayment;
    if (Year === 1) {
        NGCF.HeatIncome = TotalIncomeFromHeatSales;
        NGCF.CharIncome = AnnualIncomeFromChar;

        } else {
            NGCF.HeatIncome = GCF.HeatIncome * (1 + input.EscalationHeatSales / 100);
            NGCF.CharIncome = GCF.CharIncome * (1 + input.EscalationCharSales / 100);
        }
    NGCF.InterstOnDebtReserve = AnnualDebtReserveInterest;
    NGCF.TaxWithoutCredit = ((CombinedTaxRate / 100) / (1 - CombinedTaxRate / 100)) * (NGCF.EquityPrincipalPaid
                + NGCF.DebtPrincipalPaid + NGCF.EquityInterest - NGCF.Depreciation + NGCF.DebtReserveCF);
    if (Year === 1) {
        NGCF.TaxCredit = AnnualNetElectricityGeneration * input.ProductionTaxCredit * input.TaxCreditFrac[Year - 1];
        } else {
        NGCF.TaxCredit = AnnualNetElectricityGeneration * input.ProductionTaxCredit
                * (1 + input.EscalationProductionTaxCredit / 100) ** (NGCF.Year - 1) * input.TaxCreditFrac[Year - 1];
        }
    NGCF.Taxes = ((CombinedTaxRate / 100) / (1 - CombinedTaxRate / 100)) * (NGCF.EquityPrincipalPaid +
            NGCF.DebtPrincipalPaid + NGCF.EquityInterest - NGCF.Depreciation + NGCF.DebtReserveCF - NGCF.TaxCredit);
    NGCF.EnergyRevenueRequired = NGCF.EquityRecovery + NGCF.DebtRecovery + NGCF.BiomassFuelCostCF +
            NGCF.DualFuelCostCF + NGCF.NonFuelExpensesCF + NGCF.Taxes + NGCF.DebtReserveCF - NGCF.CapacityIncome -
            NGCF.InterstOnDebtReserve - NGCF.HeatIncome - NGCF.CharIncome;
    return NGCF;
    }
    // Total Cash Flow
    const TotalCashFlow: TotalCashFlowGas = {EquityRecovery: 0, EquityInterest: 0, EquityPrincipalPaid: 0,
                                             DebtRecovery: 0, DebtInterest: 0, DebtPrincipalPaid: 0,
                                             BiomassFuelCostCF: 0, DualFuelCostCF: 0, NonFuelExpensesCF: 0,
                                             DebtReserveCF: 0, Depreciation: 0, CapacityIncome: 0, HeatIncome: 0,
                                             CharIncome: 0, InterstOnDebtReserve: 0, TaxWithoutCredit: 0,
                                             TaxCredit: 0, Taxes: 0, EnergyRevenueRequired: 0};
    for (let i = 0; i < input.EconomicLife; i++) {
        TotalCashFlow.EquityRecovery += CashFlow[i].EquityRecovery;
        TotalCashFlow.EquityInterest += CashFlow[i].EquityInterest;
        TotalCashFlow.EquityPrincipalPaid += CashFlow[i].EquityPrincipalPaid;
        TotalCashFlow.DebtRecovery += CashFlow[i].DebtRecovery;
        TotalCashFlow.DebtInterest += CashFlow[i].DebtInterest;
        TotalCashFlow.DebtPrincipalPaid += CashFlow[i].DebtPrincipalPaid;
        TotalCashFlow.BiomassFuelCostCF += CashFlow[i].BiomassFuelCostCF;
        TotalCashFlow.DualFuelCostCF += CashFlow[i].DualFuelCostCF;
        TotalCashFlow.NonFuelExpensesCF += CashFlow[i].NonFuelExpensesCF;
        TotalCashFlow.DebtReserveCF += CashFlow[i].DebtReserveCF;
        TotalCashFlow.Depreciation += CashFlow[i].Depreciation;
        TotalCashFlow.CapacityIncome += CashFlow[i].CapacityIncome;
        TotalCashFlow.HeatIncome += CashFlow[i].HeatIncome;
        TotalCashFlow.CharIncome += CashFlow[i].CharIncome;
        TotalCashFlow.InterstOnDebtReserve += CashFlow[i].InterstOnDebtReserve;
        TotalCashFlow.TaxWithoutCredit += CashFlow[i].TaxWithoutCredit;
        TotalCashFlow.TaxCredit += CashFlow[i].TaxCredit;
        TotalCashFlow.Taxes += CashFlow[i].Taxes;
        TotalCashFlow.EnergyRevenueRequired += CashFlow[i].EnergyRevenueRequired;
    }
    // Current $ Level Annual Cost (LAC)
    const NewCurrentLAC: CurrentLAC = {CostOfMoney: 0, PresentWorth: [], TotalPresentWorth: 0,
                                       CurrentCapitalRecoveryFactor: 0, CurrentAnnualRevenueRequirements: 0,
                                       CurrentLACPerKwh: 0};
    NewCurrentLAC.CostOfMoney = input.CostOfEquity / 100;
    let TempPresentWorth: number;
    for (let i = 0; i < input.EconomicLife; i++) {
        TempPresentWorth = CashFlow[i].EnergyRevenueRequired * (1 + NewCurrentLAC.CostOfMoney) ** (- CashFlow[i].Year);
        NewCurrentLAC.TotalPresentWorth += TempPresentWorth;
        NewCurrentLAC.PresentWorth.push(TempPresentWorth);
    }
    NewCurrentLAC.CurrentCapitalRecoveryFactor = NewCurrentLAC.CostOfMoney * (1 + NewCurrentLAC.CostOfMoney)
        ** input.EconomicLife / ((1 + NewCurrentLAC.CostOfMoney) ** input.EconomicLife - 1);
    NewCurrentLAC.CurrentAnnualRevenueRequirements = NewCurrentLAC.TotalPresentWorth
        * NewCurrentLAC.CurrentCapitalRecoveryFactor;
    NewCurrentLAC.CurrentLACPerKwh = NewCurrentLAC.CurrentAnnualRevenueRequirements / AnnualNetElectricityGeneration;
    // Constant & Level Annual Cost (LAC)
    const NewConstantLAC: ConstantLAC = {RealCostOfMoney: 0, ConstantCapitalRecoveryFactor: 0,
                                         ConstantLevelAnnualRevenue: 0, ConstantLACPerKwh: 0};
    NewConstantLAC.RealCostOfMoney = (1 + NewCurrentLAC.CostOfMoney) / (1 + input.GeneralInflation / 100) - 1;
    NewConstantLAC.ConstantCapitalRecoveryFactor = NewConstantLAC.RealCostOfMoney * (1 + NewConstantLAC.RealCostOfMoney)
        ** input.EconomicLife / ((1 + NewConstantLAC.RealCostOfMoney) ** input.EconomicLife - 1);
    NewConstantLAC.ConstantLevelAnnualRevenue = NewCurrentLAC.TotalPresentWorth
        * NewConstantLAC.ConstantCapitalRecoveryFactor;
    NewConstantLAC.ConstantLACPerKwh = NewConstantLAC.ConstantLevelAnnualRevenue / AnnualNetElectricityGeneration;
    return {
        'Sensitivity Analysis': {
            'LAC Current': NewCurrentLAC.CurrentLACPerKwh,
            'LAC Constant': NewConstantLAC.ConstantLACPerKwh
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
        'Taxes': {
            'CombinedTaxRate': CombinedTaxRate
        },
        'Income Other Than Energy': {
            'AnnualCapacityPayment': AnnualCapacityPayment,
            'AnnualDebtReserveInterest': AnnualDebtReserveInterest,
            'AnnualIncomeFromChar': AnnualIncomeFromChar
        },
        'Financing': {
            'EquityRatio': EquityRatio,
            'CostOfMoney': CostOfMoney,
            'TotalCostOfPlant': TotalCostOfPlant,
            'TotalEquityCost': TotalEquityCost,
            'TotalDebtCost': TotalDebtCost,
            'CapitalRecoveryFactorEquity': CapitalRecoveryFactorEquity,
            'CapitalRecoveryFactorDebt': CapitalRecoveryFactorDebt,
            'AnnualEquityRecovery': AnnualEquityRecovery,
            'AnnualDebtPayment': AnnualDebtPayment,
            'DebtReserve': DebtReserve
        },
        'Depreciation Schedule': {
            'DepreciationRate': DepreciationRate
        },
        'Annual Cash Flow': CashFlow,
        'Total Cash Flow': TotalCashFlow,
        'Current & Level Annual Cost (LAC)': NewCurrentLAC,
        'Constant & Level Annual Cost(LAC)': NewConstantLAC
    };
}
export { GasificationPower };
