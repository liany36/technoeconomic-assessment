// Black & Veatch Transmission Line Capital Cost Calculator
import { InputModTransimission } from './input.model';

export function TransmissionCost(input: InputModTransimission) {
  const Multiplier = {
    Conductor: 0,
    Structure: 0,
    Length: 0,
    NewOrReconductor: 0,
    AverageTerrain: 0,
    Forested: 2.25,
    Flat: 1, // Scrubbed/Flat
    Wetland: 1.2,
    Farmland: 1,
    Desert: 1.05, // Desert/Barren Land
    Urban: 1.59,
    Hills: 1.4, // Rolling Hills (2-8% Slope)
    Mountain: 1.75, // Mountain (>8% Slope)
  };

  let TotalMiles;
  let WeightedMiles;
  let InitialCost = 0; // 2012
  const InflationRate = (540.7 - 464.751) / 464.751; // 2012-2019

  // 2015 Per Acre Rent ($/acre-year)
  const Rent = {
    Zone1: 8.62,
    Zone2: 17.24,
    Zone3: 34.49,
    Zone4: 51.73,
    Zone5: 68.97,
    Zone6: 103.46,
    Zone7: 172.43,
    Zone8: 344.86,
    Zone9: 689.72,
    Zone10: 1034.58,
    Zone11: 1724.3,
    Zone12: 3448.6,
  };

  const LandTaxRate = 0.01;
  const CapitalizationRate = 0.1;

  function calcLandMarketValue(rent: number) {
    return (rent - rent * LandTaxRate) / CapitalizationRate;
  }

  const LandMarketValue = {
    Zone1: calcLandMarketValue(Rent.Zone1),
    Zone2: calcLandMarketValue(Rent.Zone2),
    Zone3: calcLandMarketValue(Rent.Zone3),
    Zone4: calcLandMarketValue(Rent.Zone4),
    Zone5: calcLandMarketValue(Rent.Zone5),
    Zone6: calcLandMarketValue(Rent.Zone6),
    Zone7: calcLandMarketValue(Rent.Zone7),
    Zone8: calcLandMarketValue(Rent.Zone8),
    Zone9: calcLandMarketValue(Rent.Zone9),
    Zone10: calcLandMarketValue(Rent.Zone10),
    Zone11: calcLandMarketValue(Rent.Zone11),
    Zone12: calcLandMarketValue(Rent.Zone12),
  };
  let ROWwidth = 0;
  let AcresUnitMile;
  const OverheadCostRatio = 0.175;

  let LineCostUnitMile;
  let ROWcostUnitMile;
  let OverheadCostUnitMile;
  let AllCostUnitMile;
  let LineLossUnitMile = 0;
  let LineCost;
  let ROWcost;
  let OverheadCost;
  let AllCost;
  let LineLoss;

  switch (input.VoltageClass) {
    case '230 kV Single Circuit':
      InitialCost = 927000;
      InitialCost = InitialCost * (1 + InflationRate);
      switch (input.ConductorType) {
        case 'ACSR':
          Multiplier.Conductor = 1;
          LineLossUnitMile = 0.1336;
          break;
        case 'ACSS':
          Multiplier.Conductor = 1.08;
          LineLossUnitMile = 0.3624;
          break;
        case 'HTLS':
          Multiplier.Conductor = 3.6;
          LineLossUnitMile = 0.366;
          break;
      }
      switch (input.Structure) {
        case 'Lattice':
          Multiplier.Structure = 0.9;
          break;
        case 'Tubular Steel':
          Multiplier.Structure = 1;
          break;
      }
      switch (input.LengthCategory) {
        case '< 3 miles':
          Multiplier.Length = 1.5;
          break;
        case '3-10 miles':
          Multiplier.Length = 1.2;
          break;
        case '> 10 miles':
          Multiplier.Length = 1;
          break;
      }
      switch (input.NewOrReconductor) {
        case 'New':
          Multiplier.NewOrReconductor = 1;
          break;
        case 'Re-conductor':
          Multiplier.NewOrReconductor = 0.35;
          break;
      }
      ROWwidth = 125;
      break;
    case '230 kV Double Circuit': // -----------------------------------------------
      InitialCost = 1484000;
      InitialCost = InitialCost * (1 + InflationRate);
      switch (input.ConductorType) {
        case 'ACSR':
          Multiplier.Conductor = 1;
          LineLossUnitMile = 0.2672;
          break;
        case 'ACSS':
          Multiplier.Conductor = 1.08;
          LineLossUnitMile = 0.7249;
          break;
        case 'HTLS':
          Multiplier.Conductor = 3.6;
          LineLossUnitMile = 0.7319;
          break;
      }
      switch (input.Structure) {
        case 'Lattice':
          Multiplier.Structure = 0.9;
          break;
        case 'Tubular Steel':
          Multiplier.Structure = 1;
          break;
      }
      switch (input.LengthCategory) {
        case '< 3 miles':
          Multiplier.Length = 1.5;
          break;
        case '3-10 miles':
          Multiplier.Length = 1.2;
          break;
        case '> 10 miles':
          Multiplier.Length = 1;
          break;
      }
      switch (input.NewOrReconductor) {
        case 'New':
          Multiplier.NewOrReconductor = 1;
          break;
        case 'Re-conductor':
          Multiplier.NewOrReconductor = 0.45;
          break;
      }
      ROWwidth = 150;
      break;
  }
  TotalMiles =
    input.Miles.Forested +
    input.Miles.Flat +
    input.Miles.Wetland +
    input.Miles.Farmland +
    input.Miles.Desert +
    input.Miles.Urban +
    input.Miles.Hills +
    input.Miles.Mountain;
  WeightedMiles =
    input.Miles.Forested * Multiplier.Forested +
    input.Miles.Flat * Multiplier.Flat +
    input.Miles.Wetland * Multiplier.Wetland +
    input.Miles.Farmland * Multiplier.Farmland +
    input.Miles.Desert * Multiplier.Desert +
    input.Miles.Urban * Multiplier.Urban +
    input.Miles.Hills * Multiplier.Hills +
    input.Miles.Mountain * Multiplier.Mountain;
  Multiplier.AverageTerrain = WeightedMiles / TotalMiles;

  LineCostUnitMile =
    InitialCost *
    Multiplier.Conductor *
    Multiplier.Structure *
    Multiplier.Length *
    Multiplier.NewOrReconductor *
    Multiplier.AverageTerrain;

  AcresUnitMile = (ROWwidth * 5280) / 43560;
  ROWcostUnitMile =
    (input.Miles.Zone1 * LandMarketValue.Zone1 * AcresUnitMile +
      input.Miles.Zone2 * LandMarketValue.Zone2 * AcresUnitMile +
      input.Miles.Zone3 * LandMarketValue.Zone3 * AcresUnitMile +
      input.Miles.Zone4 * LandMarketValue.Zone4 * AcresUnitMile +
      input.Miles.Zone5 * LandMarketValue.Zone5 * AcresUnitMile +
      input.Miles.Zone6 * LandMarketValue.Zone6 * AcresUnitMile +
      input.Miles.Zone7 * LandMarketValue.Zone7 * AcresUnitMile +
      input.Miles.Zone8 * LandMarketValue.Zone8 * AcresUnitMile +
      input.Miles.Zone9 * LandMarketValue.Zone9 * AcresUnitMile +
      input.Miles.Zone10 * LandMarketValue.Zone10 * AcresUnitMile +
      input.Miles.Zone11 * LandMarketValue.Zone11 * AcresUnitMile +
      input.Miles.Zone12 * LandMarketValue.Zone12 * AcresUnitMile) /
    TotalMiles;

  OverheadCostUnitMile =
    (LineCostUnitMile + ROWcostUnitMile) * OverheadCostRatio;
  AllCostUnitMile = LineCostUnitMile + ROWcostUnitMile + OverheadCostUnitMile;

  LineCost = LineCostUnitMile * TotalMiles;
  ROWcost = ROWcostUnitMile * TotalMiles;
  OverheadCost = OverheadCostUnitMile * TotalMiles;
  AllCost = AllCostUnitMile * TotalMiles;
  LineLoss = LineLossUnitMile * TotalMiles;

  return {
    LineCost: LineCost,
    ROWcost: ROWcost,
    OverheadCost: OverheadCost,
    AllCost: AllCost,
    LineLoss: LineLoss,
  };
}
