'use strict';

// https://github.com/babel/babel/issues/13872

let { fuzz, minimize } = require('.');

let fs = require('fs');
let path = require('path');
let { parse } = require('@babel/parser');

let fn = src => {
  parse(src, { sourceType: 'module' });
};


let known = [
  'has already been declared.', // bug in shift-fuzzer
  'Yield expression is not allowed in formal parameters.',
  "'await' is not allowed in async function parameters",
];

fuzz(fn, 100000, known);
