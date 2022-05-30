module.exports = {
  env: {
    node: true,
    es2021: true,
    'jest/globals': true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'prettier',
    'plugin:github/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['jest', '@typescript-eslint', 'import', 'prettier', 'github'],
  // rules: {},
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    project: './tsconfig.json',
  },
};
