module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['airbnb-base', 'plugin:@typescript-eslint/recommended'],
  rules: {
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off',
    'class-methods-use-this': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/extensions': 'off',
    'max-classes-per-file': 'off',
    '@typescript-eslint/no-namespace': 'off',
  },
};
