module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
  ],
  plugins: ['@typescript-eslint'],
  rules: {
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-console': 'off', // Allow console statements for development
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  ignorePatterns: [
    'dist/',
    'node_modules/',
    'coverage/'
  ]
}; 