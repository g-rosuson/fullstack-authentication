module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['plugin:@typescript-eslint/recommended'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  rules: {
    quotes: ['error', 'single'],
    'no-unused-vars': ['error', { 'varsIgnorePattern': 'Access|Refresh|RefreshIfLessThan' }],
  },
}