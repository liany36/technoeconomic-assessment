import { InputModSubstation } from './input.model';

export function SubstationCost(input: InputModSubstation) {
  let BaseCostNewSubstation = 0;
  let CostPerLinePosition = 0;
  let RingBus = 0;
  let BreakerAndHalf = 0;
  let HVDCconverter500kV = 0;
  let HVDCconverter600kV = 0;
  let ShuntReactorCost = 0;
  let SeriesCapacitorCost = 0;
  let SVCcost = 0;
  const TransformerCost = {
    XFMR115o230kV: 0,
    XFMR115o345kV: 0,
    XFMR115o500kV: 0,
    XFMR138o230kV: 0,
    XFMR138o345kV: 0,
    XFMR138o500kV: 0,
    XFMR230o345kV: 0,
    XFMR230o500kV: 0,
    XFMR345o500kV: 0,
  };
  const InflationRate = (287.494 - 232.376) / 232.376; // 2012-2021
  const OverheadCostRatio = 0.175;

  switch (input.Voltage) {
    case '230 kV Substation':
      BaseCostNewSubstation = 1648000 * (1 + InflationRate);
      CostPerLinePosition = 1442000 * (1 + InflationRate);
      RingBus = 1;
      BreakerAndHalf = 1.5;
      ShuntReactorCost = 20000 * (1 + InflationRate);
      SeriesCapacitorCost = 30000 * (1 + InflationRate);
      SVCcost = 85000 * (1 + InflationRate);
      TransformerCost.XFMR115o230kV = 7000 * (1 + InflationRate);
      TransformerCost.XFMR138o230kV = 7000 * (1 + InflationRate);
      TransformerCost.XFMR230o500kV = 11000 * (1 + InflationRate);
      break;
    case '345 kV Substation':
      BaseCostNewSubstation = 2060000 * (1 + InflationRate);
      CostPerLinePosition = 2163000 * (1 + InflationRate);
      RingBus = 1;
      BreakerAndHalf = 1.5;
      ShuntReactorCost = 20000 * (1 + InflationRate);
      SeriesCapacitorCost = 10000 * (1 + InflationRate);
      SVCcost = 85000 * (1 + InflationRate);
      TransformerCost.XFMR115o345kV = 10000 * (1 + InflationRate);
      TransformerCost.XFMR138o345kV = 10000 * (1 + InflationRate);
      TransformerCost.XFMR230o345kV = 10000 * (1 + InflationRate);
      TransformerCost.XFMR345o500kV = 13000 * (1 + InflationRate);
      break;
    case '500 kV Substation':
      BaseCostNewSubstation = 2472000 * (1 + InflationRate);
      CostPerLinePosition = 2884000 * (1 + InflationRate);
      RingBus = 1;
      BreakerAndHalf = 1.5;
      HVDCconverter500kV = 445000000 * (1 + InflationRate);
      HVDCconverter600kV = 489500000 * (1 + InflationRate);
      ShuntReactorCost = 20000 * (1 + InflationRate);
      SeriesCapacitorCost = 10000 * (1 + InflationRate);
      SVCcost = 85000 * (1 + InflationRate);
      TransformerCost.XFMR115o500kV = 10000 * (1 + InflationRate);
      TransformerCost.XFMR138o500kV = 10000 * (1 + InflationRate);
      TransformerCost.XFMR230o500kV = 11000 * (1 + InflationRate);
      TransformerCost.XFMR345o500kV = 13000 * (1 + InflationRate);
      break;
  }

  let BaseCost = 0;
  let CircuitBreakers = 0;
  let HVDCconverter = 0;
  let Transformer = 0;
  let SVC = 0;
  let ShuntReactor = 0;
  let SeriesCapacitor = 0;
  let OverheadCost = 0;

  switch (input.NewOrExisting) {
    case 'New':
      BaseCost = BaseCostNewSubstation;
      break;
    case 'Existing':
      BaseCost = 0;
      break;
  }
  switch (input.CircuitBreakerType) {
    case 'Ring Bus':
      CircuitBreakers = CostPerLinePosition * RingBus * input.NoLineXFMRPositions;
      break;
    case 'Breaker and a Half':
      CircuitBreakers = CostPerLinePosition * BreakerAndHalf * input.NoLineXFMRPositions;
      break;
  }

  switch (input.HVDCconverter) {
    case '500 kV HVDC Converter':
      HVDCconverter = HVDCconverter500kV;
      break;
    case '600 kV HVDC Converter':
      HVDCconverter = HVDCconverter600kV;
      break;
    case 'No':
      break;
  }
  switch (input.TransformerType) {
    case '115/230 kV XFMR':
      Transformer = TransformerCost.XFMR115o230kV;
      break;
    case '115/345 kV XFMR':
      Transformer = TransformerCost.XFMR115o345kV;
      break;
    case '115/500 kV XFMR':
      Transformer = TransformerCost.XFMR115o500kV;
      break;
    case '138/230 kV XFMR':
      Transformer = TransformerCost.XFMR138o230kV;
      break;
    case '138/345 kV XFMR':
      Transformer = TransformerCost.XFMR138o345kV;
      break;
    case '138/500 kV XFMR':
      Transformer = TransformerCost.XFMR138o500kV;
      break;
    case '230/345 kV XFMR':
      Transformer = TransformerCost.XFMR230o345kV;
      break;
    case '230/500 kV XFMR':
      Transformer = TransformerCost.XFMR230o500kV;
      break;
    case '345/500 kV XFMR':
      Transformer = TransformerCost.XFMR345o500kV;
      break;
  }
  Transformer = Transformer * input.MVAratingPerTransformer * input.NoTransformers;
  SVC = input.SVCmvarRating * SVCcost;
  ShuntReactor = input.ShuntReactorMVARrating * ShuntReactorCost;
  SeriesCapacitor = input.SeriesCapacitorMVARrating * SeriesCapacitorCost;
  let TotalSubstationCost =
    BaseCost + CircuitBreakers + HVDCconverter + Transformer + SVC + ShuntReactor + SeriesCapacitor;
  OverheadCost = TotalSubstationCost * OverheadCostRatio;
  TotalSubstationCost += OverheadCost;
  return {
    BaseCost,
    CircuitBreakers,
    HVDCconverter,
    Transformer,
    SVC,
    ShuntReactor,
    SeriesCapacitor,
    OverheadCost,
    TotalSubstationCost,
  };
}
