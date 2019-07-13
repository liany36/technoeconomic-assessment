import { InputVarMod } from 'tea.model';

function calculate(input: InputVarMod) {
    const result = input.cost * input.time;
    return { 'resultName': result };
}

export { calculate };
