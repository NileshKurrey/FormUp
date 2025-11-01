// eslint.config.js

import { defineConfig } from 'eslint/config'
import globals from 'globals'

export default defineConfig([
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        myCustomGlobal: 'readonly',
      },
    },
    // ...other config
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'double'],
      'no-unused-vars': 'warn',
      'no-console': 'warn',
      indent: ['error', 'tab'],
      'comma-dangle': ['error', 'always-multiline'],
    },
  },
])
