module.exports = {
  env: {
    node: true,
  },
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  settings: {
    'import/resolver': {
      node: {
        paths: ['src/'],
      },
    },
  },
  parserOptions: {
    sourceType: 'module',
  },
  parser: '@babel/eslint-parser',
  rules: {
    'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    'class-methods-use-this': 'off',
    'no-param-reassign': 'off',
    camelcase: 'off',
    'no-unused-vars': ['error', { argsIgnorePattern: 'next' }],
  },
};
