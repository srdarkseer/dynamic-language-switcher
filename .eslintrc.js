module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended'
  ],
  plugins: ['@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    'no-console': 'warn',
  },
  env: {
    node: true,
    es6: true,
    browser: true,
    jest: true
  },
  ignorePatterns: [
    'tests/**/*',
    'dist/**/*',
    'examples/**/*',
    'node_modules/**/*'
  ]
}; 