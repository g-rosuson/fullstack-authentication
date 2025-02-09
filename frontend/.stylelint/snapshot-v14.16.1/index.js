const stylelint = require('stylelint-snapshot-14.16.1');

const indentation = require('stylelint-snapshot-14.16.1/lib/rules/indentation');
const noEmptyFirstLine = require('stylelint-snapshot-14.16.1/lib/rules/no-empty-first-line');
const noEolWhitespace = require('stylelint-snapshot-14.16.1/lib/rules/no-eol-whitespace');
const noExtraSemicolons = require('stylelint-snapshot-14.16.1/lib/rules/no-extra-semicolons');
const maxEmptyLines = require('stylelint-snapshot-14.16.1/lib/rules/max-empty-lines');
const stringQuotes = require('stylelint-snapshot-14.16.1/lib/rules/string-quotes');
const valueListCommaSpaceAfter = require('stylelint-snapshot-14.16.1/lib/rules/value-list-comma-space-after');
const valueListMaxEmptyLines = require('stylelint-snapshot-14.16.1/lib/rules/value-list-max-empty-lines');
const declarationColonSpaceBefore = require('stylelint-snapshot-14.16.1/lib/rules/declaration-colon-space-before');
const declarationColonSpaceAfter = require('stylelint-snapshot-14.16.1/lib/rules/declaration-colon-space-after');
const declarationColonNewlineAfter = require('stylelint-snapshot-14.16.1/lib/rules/declaration-colon-newline-after');
const declarationBlockTrailingSemicolon = require('stylelint-snapshot-14.16.1/lib/rules/declaration-block-trailing-semicolon');
const blockClosingBraceNewlineAfter = require('stylelint-snapshot-14.16.1/lib/rules/block-closing-brace-newline-after');
const selectorAttributeBracketsSpaceInside = require('stylelint-snapshot-14.16.1/lib/rules/selector-attribute-brackets-space-inside');
const selectorAttributeOperatorSpaceBefore = require('stylelint-snapshot-14.16.1/lib/rules/selector-attribute-operator-space-before');
const selectorAttributeOperatorSpaceAfter = require('stylelint-snapshot-14.16.1/lib/rules/selector-attribute-operator-space-after');
const selectorMaxEmptyLines = require('stylelint-snapshot-14.16.1/lib/rules/selector-max-empty-lines');
const numberLeadingZero = require('stylelint-snapshot-14.16.1/lib/rules/number-leading-zero');

module.exports = [
  stylelint.createPlugin("snapshot-v14.16.1/indentation", indentation),
  stylelint.createPlugin("snapshot-v14.16.1/no-empty-first-line", noEmptyFirstLine),
  stylelint.createPlugin("snapshot-v14.16.1/no-eol-whitespace", noEolWhitespace),
  stylelint.createPlugin("snapshot-v14.16.1/no-extra-semicolons", noExtraSemicolons),
  stylelint.createPlugin("snapshot-v14.16.1/max-empty-lines", maxEmptyLines),
  stylelint.createPlugin("snapshot-v14.16.1/string-quotes", stringQuotes),
  stylelint.createPlugin("snapshot-v14.16.1/value-list-comma-space-after", valueListCommaSpaceAfter),
  stylelint.createPlugin("snapshot-v14.16.1/value-list-max-empty-lines", valueListMaxEmptyLines),
  stylelint.createPlugin("snapshot-v14.16.1/declaration-colon-space-before", declarationColonSpaceBefore),
  stylelint.createPlugin("snapshot-v14.16.1/declaration-colon-space-after", declarationColonSpaceAfter),
  stylelint.createPlugin("snapshot-v14.16.1/declaration-colon-newline-after", declarationColonNewlineAfter),
  stylelint.createPlugin("snapshot-v14.16.1/declaration-block-trailing-semicolon", declarationBlockTrailingSemicolon),
  stylelint.createPlugin("snapshot-v14.16.1/block-closing-brace-newline-after", blockClosingBraceNewlineAfter),
  stylelint.createPlugin("snapshot-v14.16.1/selector-attribute-brackets-space-inside", selectorAttributeBracketsSpaceInside),
  stylelint.createPlugin("snapshot-v14.16.1/selector-attribute-brackets-space-before", selectorAttributeOperatorSpaceBefore),
  stylelint.createPlugin("snapshot-v14.16.1/selector-attribute-brackets-space-after", selectorAttributeOperatorSpaceAfter),
  stylelint.createPlugin("snapshot-v14.16.1/selector-max-empty-lines", selectorMaxEmptyLines),
  stylelint.createPlugin("snapshot-v14.16.1/number-leading-zero", numberLeadingZero)
]