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
  overrides: [
    {
      files: ['__tests__/**/*.ts'],
      plugins: ['jest'],
      extends: ['plugin:jest/recommended'],
      rules: { 'filenames/match-regex': 'off' },
    },
  ],
  rules: {
    'i18n-text/no-en': 'off',
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import', 'prettier', 'github'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    project: './tsconfig.json',
  },
};
