'use strict';

let { fuzz, minimize } = require('.');

let fs = require('fs');
let path = require('path');
let { parseSync } = require('@swc/core');

let parse = src => {
  parseSync(src, { isModule: true });
};


let known = [
  'Unterminated string constant',
  'Invalid string escape',
  'Unterminated template',
  'Unexpected eof',
  'Expected )',
  'Unexpected token `?`',
  'Unexpected token `|`',
  'Unexpected token `^`',
  'Unexpected token `)`',
  'Unexpected token `;`',
  'Unexpected token `,`',
  'got regexp literal',
  'Expected unicode escape',
  "'yield' cannot be used as a parameter within generator",
];

fuzz(parse, 10000, known);
