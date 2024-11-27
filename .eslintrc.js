module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
        "google",
        'plugin:@typescript-eslint/recommended',
        'prettier' // Add this line to extend Prettier
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
    },
    plugins: [
        '@typescript-eslint',
        'prettier' // Add this line to include Prettier as a plugin
    ],
    rules: {
        'prettier/prettier': 'error', // Use the prettier rule with error severity
    }
};