import js from '@eslint/js'
import globals from 'globals'
import vue from 'eslint-plugin-vue'
import importPlugin from 'eslint-plugin-import'
import promise from 'eslint-plugin-promise'
import sonarjs from 'eslint-plugin-sonarjs'
import regexp from 'eslint-plugin-regexp'
import unusedImports from 'eslint-plugin-unused-imports'

import { defineConfig } from 'eslint/config'

export default defineConfig([
  js.configs.recommended,
  vue.configs['flat/recommended'],

  {
    files: ['**/*.{js,vue}'],

    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },

    plugins: {
      vue,
      import: importPlugin,
      promise,
      sonarjs,
      regexp,
      'unused-imports': unusedImports,
    },

    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

      'indent': ['error', 2],
      'semi': ['error', 'never'],

      'comma-spacing': ['error', { before: false, after: true }],
      'key-spacing': ['error', { afterColon: true }],
      'object-curly-spacing': ['error', 'always'],
      'comma-dangle': ['error', 'always-multiline'],

      'no-multiple-empty-lines': ['error', { max: 1 }],

      'arrow-parens': ['error', 'as-needed'],
      'newline-before-return': 'error',

      'array-element-newline': ['error', 'consistent'],
      'array-bracket-newline': ['error', 'consistent'],

      'camelcase': 'off',
      'max-len': 'off',

      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
        },
      ],

      'import/newline-after-import': ['error', { count: 1 }],
      'import/prefer-default-export': 'off',

      'promise/always-return': 'off',
      'promise/catch-or-return': 'off',

      'sonarjs/no-duplicate-string': 'off',

      'vue/multi-word-component-names': 'off',
      'vue/block-tag-newline': 'error',
      'vue/no-useless-mustaches': 'error',
      'vue/no-useless-v-bind': 'error',
      'vue/prefer-true-attribute-shorthand': 'error',
      'vue/no-empty-component-block': 'error',
    },
  },
])

