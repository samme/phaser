import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([ globalIgnores([
    'src/phaser-esm.js',
    'src/phaser-arcade-physics.js',
    'src/animations/config.json',
    'src/physics/matter-js/lib/',
    'src/physics/matter-js/poly-decomp/',
    'src/polyfills/',
    'src/renderer/webgl/shaders/',
    'src/geom/polygon/Earcut.js',
    'src/utils/array/StableSort.js',
    'src/utils/object/Extend.js',
    'src/structs/RTree.js',
    'plugins/spine/dist/',
    'plugins/spine/src/runtimes/',
    '**/scripts/',
    '**/webpack.*',
    '**/webpack.config.js',
    '**/webpack-nospector.config.js',
    '**/webpack.dist.config.js',
    '**/webpack.fb.config.js',
    '**/webpack.fb.dist.config.js',
    '**/build/'
]), {
    extends: compat.extends('eslint:recommended'),
    plugins: {},

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.commonjs,
            WEBGL_RENDERER: true,
            CANVAS_RENDERER: true,
            Phaser: true,
            process: true,
            ActiveXObject: true
        }
    },

    rules: {
        'no-cond-assign': [ 'error', 'except-parens' ],
        'no-duplicate-case': [ 'error' ],

        'no-unused-vars': [ 'error', {
            args: 'none'
        } ],

        'accessor-pairs': 'error',
        curly: 'error',
        eqeqeq: [ 'error', 'smart' ],
        'no-alert': 'error',
        'no-caller': 'error',

        'no-console': [ 'error', {
            allow: [ 'warn', 'log', 'info', 'debug', 'count', 'time', 'timeEnd' ]
        } ],

        'no-floating-decimal': 'error',
        'no-invalid-this': 'error',
        'no-multi-spaces': 'error',
        'no-multi-str': 'error',
        'no-new-func': 'error',
        'no-new-wrappers': 'error',
        'no-redeclare': 'error',
        'no-self-assign': 'error',
        'no-self-compare': 'error',
        yoda: [ 'error', 'never' ],
        'array-bracket-spacing': [ 'error', 'always' ],
        'block-spacing': [ 'error', 'always' ],

        'brace-style': [ 'error', 'allman', {
            allowSingleLine: true
        } ],

        camelcase: 'error',
        'comma-dangle': [ 'error', 'never' ],
        'comma-style': [ 'error', 'last' ],
        'computed-property-spacing': [ 'error', 'never' ],
        'consistent-this': [ 'error', '_this' ],
        'eol-last': [ 'error' ],
        'func-call-spacing': [ 'error', 'never' ],

        indent: [ 'error', 4, {
            SwitchCase: 1
        } ],

        'key-spacing': [ 'error', {
            beforeColon: false,
            afterColon: true
        } ],

        'keyword-spacing': [ 'error', {
            after: true
        } ],

        'linebreak-style': [ 'off' ],

        'lines-around-comment': [ 'error', {
            beforeBlockComment: true,
            afterBlockComment: false,
            beforeLineComment: true,
            afterLineComment: false,
            allowBlockStart: true,
            allowBlockEnd: false,
            allowObjectStart: true,
            allowArrayStart: true
        } ],

        'new-parens': 'error',
        'no-constant-condition': 0,
        'no-array-constructor': 'error',
        'no-lonely-if': 'error',
        'no-mixed-spaces-and-tabs': 'error',
        'no-plusplus': 'off',
        'no-prototype-builtins': 'off',

        'no-trailing-spaces': [ 'error', {
            skipBlankLines: true,
            ignoreComments: true
        } ],

        'no-underscore-dangle': 'off',
        'no-whitespace-before-property': 'error',

        'object-curly-newline': [ 'error', {
            multiline: true,
            minProperties: 0,
            consistent: true
        } ],

        'one-var-declaration-per-line': [ 'error', 'initializations' ],
        'quote-props': [ 'error', 'as-needed' ],
        quotes: [ 'error', 'single' ],

        'semi-spacing': [ 'error', {
            before: false,
            after: true
        } ],

        semi: [ 'error', 'always' ],
        'space-before-blocks': 'error',
        'space-before-function-paren': 'error',
        'space-in-parens': [ 'error', 'never' ],

        'space-infix-ops': [ 'error', {
            int32Hint: true
        } ],

        'wrap-regex': 'error',

        'spaced-comment': [ 'error', 'always', {
            block: {
                balanced: true,
                exceptions: [ '*', '!' ]
            }
        } ],

        'no-irregular-whitespace': [ 'error', {
            skipComments: true
        } ]
    }
} ]);
