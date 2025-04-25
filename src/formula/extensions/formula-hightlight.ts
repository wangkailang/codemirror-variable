import { syntaxHighlighting, HighlightStyle } from '@codemirror/language';
import { tags } from '@lezer/highlight';

const highlighting = HighlightStyle.define([
  { tag: tags.function(tags.variableName), class: 'excel-formula-function' },
  { tag: tags.number, class: 'excel-formula-number' },
  { tag: tags.string, class: 'excel-formula-string' },
  { tag: tags.bool, class: 'excel-formula-boolean' },
  { tag: tags.operator, class: 'excel-formula-operator' },
  { tag: tags.paren, class: 'excel-formula-paren' },
  { tag: tags.separator, class: 'excel-formula-separator' },
  
  
]);

export const formulaHighlighting = () => syntaxHighlighting(highlighting);