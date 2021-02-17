const gpoExample = {
  model: "GPO",
  input: {
    CapitalCost: 70000000,
    ElectricalFuelBaseYear: {
      NetElectricalCapacity: 25000,
      CapacityFactor: 85,
      MoistureContent: 50,
      NetStationEfficiency: 20,
      FuelHeatingValue: 18608,
      FuelAshConcentration: 5,
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
  },
  CapitalCost: {
    base: 70000000,
    high: 200000000,
    low: 0,
  },
  BiomassFuelCost: {
    base: 22.05,
    high: 100,
    low: 0,
  },
  DebtRatio: {
    base: 75,
    high: 100,
    low: 0,
  },
  DebtInterestRate: {
    base: 5,
    high: 15,
    low: 1,
  },
  CostOfEquity: {
    base: 15,
    high: 50,
    low: 1,
  },
  NetStationEfficiency: {
    base: 20,
    high: 50,
    low: 5,
  },
  CapacityFactor: {
    base: 85,
    high: 100,
    low: 40,
  },
};

const chpExample = {
  model: "CHP",
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
  },
  CapitalCost: {
    base: 70000000,
    high: 200000000,
    low: 0,
  },
  BiomassFuelCost: {
    base: 22.05,
    high: 100,
    low: 0,
  },
  DebtRatio: {
    base: 75,
    high: 100,
    low: 0,
  },
  DebtInterestRate: {
    base: 5,
    high: 15,
    low: 1,
  },
  CostOfEquity: {
    base: 15,
    high: 50,
    low: 1,
  },
  NetStationEfficiency: {
    base: 20,
    high: 50,
    low: 5,
  },
  CapacityFactor: {
    base: 85,
    high: 100,
    low: 40,
  },
};

const gpExample = {
  model: "GP",
  input: {
    CapitalCost: {
      GasifierSystemCapitalCost: 300000,
      GasCleaningSystemCapitalCost: 50000,
      PowerGenerationCapitalCost: 450000,
      EmissionControlSystemCapitalCost: 25000,
      HeatRecoverySystemCapitalCost: 50000,
    },
    ElectricalFuelBaseYear: {
      NetElectricalCapacity: 25000,
      CapacityFactor: 85,
      MoistureContent: 50,
      GrossElectricalCapacity: 650,
      HHVEfficiency: 65,
      NetHHVEfficiency: 23,
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
      DualFuelCost: 0.3,
      WasteTreatment: 2000,
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
  },
  CapitalCost: {
    base: 875000,
    high: 200000000,
    low: 0,
  },
  BiomassFuelCost: {
    base: 22.05,
    high: 100,
    low: 0,
  },
  DebtRatio: {
    base: 75,
    high: 100,
    low: 0,
  },
  DebtInterestRate: {
    base: 5,
    high: 15,
    low: 1,
  },
  CostOfEquity: {
    base: 15,
    high: 50,
    low: 1,
  },
  NetStationEfficiency: {
    base: 23,
    high: 50,
    low: 5,
  },
  CapacityFactor: {
    base: 85,
    high: 100,
    low: 40,
  },
};

export {
  gpoExample,
  chpExample,
  gpExample
}