'use strict';

// https://github.com/meriyah/meriyah/issues/226

let { fuzz, minimize } = require('.');

let fs = require('fs');
let path = require('path');
let { parseModule } = require('meriyah');

let fn = src => {
  if (src.includes('async')) return; // many bugs here
  parseModule(src, { sourceType: 'module' });
};


let known = [
];

fuzz(fn, 100000, known);
