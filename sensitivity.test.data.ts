import { InputModSensitivity } from './input.model';

const gpoExample: InputModSensitivity = {
  model: 'GPO',
  CapitalCost: {
    high: 200000000,
    low: 0,
  },
  BiomassFuelCost: {
    high: 100,
    low: 0,
  },
  DebtRatio: {
    high: 100,
    low: 0,
  },
  DebtInterestRate: {
    high: 15,
    low: 1,
  },
  CostOfEquity: {
    high: 50,
    low: 1,
  },
  NetStationEfficiency: {
    high: 50,
    low: 5,
  },
  CapacityFactor: {
    high: 100,
    low: 40,
  },
  input: {
    CapitalCost: 70000000,
    ElectricalFuelBaseYear: {
      NetElectricalCapacity: 25000,
      CapacityFactor: 85,
      NetStationEfficiency: 20,
      MoistureContent: 50,
      FuelHeatingValue: 18608,
      FuelAshConcentration: 5,
    },
    ExpensesBaseYear: {
      BiomassFuelCost: 22.05,
      LaborCost: 2000000,
      MaintenanceCost: 1500000,
      InsurancePropertyTax: 1400000,
      Utilities: 200000,
      AshDisposal: 100000,
      Management: 200000,
      OtherOperatingExpenses: 400000,
    },
    Taxes: {
      FederalTaxRate: 34,
      StateTaxRate: 9.6,
      ProductionTaxCredit: 0.009,
    },
    Financing: {
      DebtRatio: 75,
      InterestRateOnDebt: 5,
      EconomicLife: 20,
      CostOfEquity: 15,
    },
    IncomeOtherThanEnergy: {
      CapacityPayment: 166,
      InterestRateOnDebtReserve: 5,
    },
    EscalationInflation: {
      GeneralInflation: 2.1,
      EscalationBiomassFuel: 2.1,
      EscalationProductionTaxCredit: 2.1,
      EscalationOther: 2.1,
    },
    TaxCreditFrac: [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    CarbonCredit: {
      CreditPrice: 196,
      CIscore: 10,
      EnergyEconomyRatio: 1,
    },
    IncludeCarbonCredit: false,
    FirstYear: 2016,
  },
};

const chpExample: InputModSensitivity = {
  model: 'CHP',
  CapitalCost: {
    high: 200000000,
    low: 0,
  },
  BiomassFuelCost: {
    high: 100,
    low: 0,
  },
  DebtRatio: {
    high: 100,
    low: 0,
  },
  DebtInterestRate: {
    high: 15,
    low: 1,
  },
  CostOfEquity: {
    high: 50,
    low: 1,
  },
  NetStationEfficiency: {
    high: 50,
    low: 5,
  },
  CapacityFactor: {
    high: 100,
    low: 40,
  },
  input: {
    CapitalCost: 70000000,
    ElectricalFuelBaseYear: {
      NetElectricalCapacity: 25000,
      CapacityFactor: 85,
      MoistureContent: 50,
      NetStationEfficiency: 20,
      FuelHeatingValue: 18608,
      FuelAshConcentration: 5,
      GrossElectricalCapacity: 28000,
    },
    HeatBaseYear: {
      AggregateFractionOfHeatRecovered: 60,
      AggregateSalesPriceForHeat: 0.0102,
    },
    ExpensesBaseYear: {
      BiomassFuelCost: 22.05,
      LaborCost: 2000000,
      MaintenanceCost: 1500000,
      InsurancePropertyTax: 1400000,
      Utilities: 200000,
      Management: 200000,
      OtherOperatingExpenses: 400000,
      AshDisposal: 100000,
    },
    Taxes: {
      FederalTaxRate: 34,
      StateTaxRate: 9.6,
      ProductionTaxCredit: 0.009,
    },
    Financing: {
      DebtRatio: 75,
      InterestRateOnDebt: 5,
      EconomicLife: 20,
      CostOfEquity: 15,
    },
    IncomeOtherThanEnergy: {
      CapacityPayment: 166,
      InterestRateOnDebtReserve: 5,
      SalesPriceForChar: 0,
    },
    EscalationInflation: {
      GeneralInflation: 2.1,
      EscalationBiomassFuel: 2.1,
      EscalationProductionTaxCredit: 2.1,
      EscalationHeatSales: 2.1,
      EscalationOther: 2.1,
      EscalationDualFuel: 2.1,
      EscalationCharSales: 2.1,
    },
    TaxCreditFrac: [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    CarbonCredit: {
      CreditPrice: 196,
      CIscore: 10,
      EnergyEconomyRatio: 1,
    },
    IncludeCarbonCredit: false,
    FirstYear: 2016,
  },
};

const gpExample: InputModSensitivity = {
  model: 'GP',
  CapitalCost: {
    high: 2000000,
    low: 0,
  },
  BiomassFuelCost: {
    high: 100,
    low: 0,
  },
  DebtRatio: {
    high: 100,
    low: 0,
  },
  DebtInterestRate: {
    high: 15,
    low: 1,
  },
  CostOfEquity: {
    high: 50,
    low: 1,
  },
  NetStationEfficiency: {
    high: 50,
    low: 5,
  },
  CapacityFactor: {
    high: 100,
    low: 40,
  },
  input: {
    doSensitivityAnalysis: false,
    CapitalCostElements: {
      GasifierSystemCapitalCost: 300000,
      GasCleaningSystemCapitalCost: 50000,
      PowerGenerationCapitalCost: 450000,
      EmissionControlSystemCapitalCost: 25000,
      HeatRecoverySystemCapitalCost: 50000,
    },
    CapitalCost: 0,
    ElectricalFuelBaseYear: {
      NetElectricalCapacity: 500,
      CapacityFactor: 85,
      MoistureContent: 50,
      GrossElectricalCapacity: 650,
      HHVEfficiency: 65,
      NetStationEfficiency: 23,
      FractionOfInputEnergy: 20,
      CO: 20,
      H2: 12,
      Hydrocarbons: 5,
      CO2: 12,
      O2: 0,
      HHV: 18608,
      AshContent: 5,
      CarbonConcentration: 30,
    },
    HeatBaseYear: {
      AggregateFractionOfHeatRecovered: 50,
      AggregateSalesPriceForHeat: 0.01,
    },
    ExpensesBaseYear: {
      BiomassFuelCost: 22.05,
      LaborCost: 20000,
      MaintenanceCost: 4000,
      InsurancePropertyTax: 1000,
      Utilities: 1000,
      Management: 1000,
      OtherOperatingExpenses: 1000,
      DualFuelCost: 0.3,
      WasteTreatment: 2000,
    },
    Taxes: {
      FederalTaxRate: 34,
      StateTaxRate: 9.6,
      ProductionTaxCredit: 0.009,
    },
    Financing: {
      DebtRatio: 90,
      InterestRateOnDebt: 5,
      EconomicLife: 20,
      CostOfEquity: 15,
    },
    IncomeOtherThanEnergy: {
      CapacityPayment: 0,
      InterestRateOnDebtReserve: 2,
      SalesPriceForChar: 0,
    },
    EscalationInflation: {
      GeneralInflation: 2.1,
      EscalationBiomassFuel: 2.1,
      EscalationProductionTaxCredit: 2.1,
      EscalationHeatSales: 2.1,
      EscalationOther: 2.1,
      EscalationDualFuel: 2.1,
      EscalationCharSales: 2.1,
    },
    TaxCreditFrac: [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    CarbonCredit: {
      CreditPrice: 196,
      CIscore: 10,
      EnergyEconomyRatio: 1,
    },
    IncludeCarbonCredit: false,
    FirstYear: 2016,
  },
};

export { gpoExample, chpExample, gpExample };
