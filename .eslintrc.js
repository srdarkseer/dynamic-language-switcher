module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended'
  ],
  plugins: ['@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {
    'no-unused-vars': 'error',
    'no-console': 'warn',
  },
  env: {
    node: true,
    es6: true,
    browser: true,
    jest: true
  },
  ignorePatterns: [
    'src/__tests__/**/*',
    'dist/**/*',
    'examples/**/*'
  ]
}; 