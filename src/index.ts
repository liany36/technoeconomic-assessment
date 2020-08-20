import { GasificationPower } from './models/gasification-power';
import { GenericCombinedHeatPower } from './models/generic-combined-heat-power';
import { GenericPowerOnly } from './models/generic-power-only';
import { Hydrogen } from './models/hydrogen';
import {
  InputModCHP,
  InputModGP,
  InputModGPO,
  InputModHydrogen,
  InputModSubstation,
  InputModTransimission,
} from './models/input.model';
import { SubstationCost } from './models/substation';
import { TransmissionCost } from './models/transmission';

export const genericPowerOnly = (params: InputModGPO) => {
  return GenericPowerOnly(params);
};

export const genericCombinedHeatPower = (params: InputModCHP) => {
  return GenericCombinedHeatPower(params);
};

export const gasificationPower = (params: InputModGP) => {
  return GasificationPower(params);
};

export const hydrogen = (params: InputModHydrogen) => {
  return Hydrogen(params);
};

export const transmission = (params: InputModTransimission) => {
  return TransmissionCost(params);
};

export const substation = (params: InputModSubstation) => {
  return SubstationCost(params);
};
