module.exports = {
    "extends": "airbnb-base",
    env: {
        node: true,
        browser: true,
        jquery: true,
    },
    // add your custom rules here
    rules: {
      'no-multiple-empty-lines': ["error", { "max": 1, "maxEOF": 0 }],
      'no-console': 0,
      'no-param-reassign': 'off',
      'no-underscore-dangle': 'off',
      'no-irregular-whitespace': ["error", { "skipRegExps": true }],
    }
};