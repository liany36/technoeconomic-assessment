import { GasificationPower } from './gasification-power';
import { GenericPowerOnly } from './generic-power-only';
import { InputVarMod } from './tea.model';

function calculate(input: InputVarMod) {

    const ResultFromGasificationPower = GasificationPower(input);
    const ResultFromGenericPowerOnly = GenericPowerOnly(input);
    return { ResultFromGasificationPower, ResultFromGenericPowerOnly };
}

export { calculate };
