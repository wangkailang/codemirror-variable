import type { CompletionContext, CompletionResult } from '@codemirror/autocomplete';
import { autocompletion } from '@codemirror/autocomplete';
const formulaFunctions = [
  {
    label: "SUM",
    type: "function",
    detail: "Adds all the numbers in a range of cells",
    info: "SUM(number1, [number2], ...)",
  },
  {
    label: "AVERAGE",
    type: "function",
    detail: "Returns the average of its arguments",
    info: "AVERAGE(number1, [number2], ...)",
  },
  {
    label: "COUNT",
    type: "function",
    detail: "Counts how many numbers are in the list of arguments",
    info: "COUNT(value1, [value2], ...)",
  },
  {
    label: "MAX",
    type: "function",
    detail: "Returns the maximum value in a list of arguments",
    info: "MAX(number1, [number2], ...)",
  },
  {
    label: "MIN",
    type: "function",
    detail: "Returns the minimum value in a list of arguments",
    info: "MIN(number1, [number2], ...)",
  },
  {
    label: "IF",
    type: "function",
    detail: "Returns one value if a condition is true and another value if it's false",
    info: "IF(logical_test, value_if_true, [value_if_false])",
  },
  {
    label: "AND",
    type: "function",
    detail: "Returns TRUE if all of its arguments are TRUE",
    info: "AND(logical1, [logical2], ...)",
  },
  {
    label: "OR",
    type: "function",
    detail: "Returns TRUE if any argument is TRUE",
    info: "OR(logical1, [logical2], ...)",
  },
];

function formulaCompletions(context: CompletionContext): CompletionResult | null {
  const word = context.matchBefore(/[A-Za-z0-9_]*$/);
  
  if (!word) return null;
  
  if (word.from === word.to && !context.explicit) return null;
  
  return {
    from: word.from,
    options: formulaFunctions.map(func => ({
      label: func.label,
      type: func.type as "function",
      detail: func.detail,
      info: func.info,
      apply: `${func.label}()`,
      displayText: `${func.label} - ${func.detail}`
    }))
  };
}

export const formulaAutocompletion = () => autocompletion({ override: [formulaCompletions] });