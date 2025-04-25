import { styleTags, tags } from '@lezer/highlight';

export const formulaHighlighting = styleTags({
  Function: tags.function(tags.variableName),
  Number: tags.number,
  String: tags.string,
  Boolean: tags.bool,
  Operator: tags.operator,
  "(": tags.paren,
  ")": tags.paren,
  ",": tags.separator
});
