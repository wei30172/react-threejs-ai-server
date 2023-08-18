module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  rules: {
    'quotes': ['warn', 'single'],
    'indent': ['warn', 2],
    'semi': ['warn', 'never'],
    'comma-dangle': ['warn', 'never']
  }
}