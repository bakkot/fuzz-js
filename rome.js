'use strict';

let { fuzz, minimize } = require('.');

let fs = require('fs');
let path = require('path');
let { execSync, exec } = require('child_process');

let fn = src => {
  fs.writeFileSync('__tmp.js', src, 'utf8');
  return new Promise((res, rej) => {
    exec('./node_modules/.bin/rome check __tmp.js', {}, (err, stdout, stderr) => {
      if (err == null) {
        res();
      }
      rej(new Error(stderr));
    });
  });
};

let known = [
  'break async',
  'continue async',
  '</',
];

fuzz(fn, 10000, known);
