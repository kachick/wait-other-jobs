module.exports = {
  env: {
    es2021: true,
  },
  extends: ['airbnb-base', 'airbnb-typescript/base', 'prettier', 'plugin:github/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['jest', '@typescript-eslint', 'prettier', 'github'],
  rules: {
    'prettier/prettier': ['error'],
    'import/extensions': 0,
    'import/prefer-default-export': 0,
  },
  parserOptions: {
    ecmaVersion: 9,
    sourceType: 'module',
    project: './tsconfig.json',
  },
};
