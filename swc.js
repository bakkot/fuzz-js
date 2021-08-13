'use strict';


let { fuzz, minimize } = require('.');

/*
// parseSync writes to stderr directly, alas, so we have to resort to shenanigans to figure out what the error actually was 
let { parseSync } = require('@swc/core');

let parse = src => {
  parseSync(src, { isModule: true });
};
*/

let fs = require('fs');
let path = require('path');
let { exec } = require('child_process');

let file = path.resolve(__dirname, 'build/in.js');

let parse = async src => {
  fs.writeFileSync(file, src, 'utf8');
  return new Promise((res, rej) => {
    exec(`node -e "require('@swc/core').parseSync(fs.readFileSync('${file}', 'utf8'))"`, {}, (err, stdout, stderr) => {
      if (err == null) {
        res();
      }
      rej(new Error(stderr));
    });
  })
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

fuzz(parse, 1000, known);
