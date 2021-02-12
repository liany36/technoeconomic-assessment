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
    base: 0,
    high: 50,
    low: 0,
  },
  CapacityFactor: {
    base: 85,
    high: 100,
    low: 40,
  },
};

export {
  gpoExample
}