import { GasificationPower } from './models/gasification-power';
import { GenericCombinedHeatPower } from './models/generic-combined-heat-power';
import { GenericPowerOnly } from './models/generic-power-only';
import { Hydrogen } from './models/hydrogen';
import {
  InputModCHP,
  InputModGP,
  InputModGPO,
  InputModHydrogen
} from './models/input.model';

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
