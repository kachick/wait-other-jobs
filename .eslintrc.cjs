module.exports = {
  env: {
    node: true,
    es2021: true,
    'jest/globals': true,
  },
  plugins: ['deprecation', '@typescript-eslint', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
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
    'deprecation/deprecation': 'error',
    'no-restricted-syntax': [
      'error',
      {
        selector: 'TSEnumDeclaration',
        message: "Don't declare enums.",
      },
    ],
    'prettier/prettier': 'off',
    'no-mixed-operators': 'error',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    project: './tsconfig.json',
  },
};
