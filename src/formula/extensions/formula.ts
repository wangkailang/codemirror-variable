import { LRLanguage, LanguageSupport } from '@codemirror/language';
import { parser } from '../formula.parser';

export const excelFormulaLanguage = LRLanguage.define({
  parser,
  languageData: {
    commentTokens: { line: "//" },
    closeBrackets: { brackets: ["(", "[", "{", "'", '"'] },
    indentOnInput: /^\s*[})\]]$/
  }
});

// Register Excel formula function completions
const excelFunctions = [
  "SUM", "AVERAGE", "COUNT", "MAX", "MIN", "IF", "AND", "OR", 
  "VLOOKUP", "HLOOKUP", "INDEX", "MATCH", "CONCATENATE", "LEN",
  "LEFT", "RIGHT", "MID", "TRIM", "ROUND", "ROUNDUP", "ROUNDDOWN"
];

export function formula() {
  return new LanguageSupport(excelFormulaLanguage, [
    excelFormulaLanguage.data.of({
      autocomplete: {
        override: context => {
          return {
            from: context.pos,
            options: excelFunctions.map(name => ({
              label: name,
              type: "function"
            }))
          };
        }
      }
    })
  ]);
}