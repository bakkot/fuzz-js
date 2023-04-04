'use strict';

// https://github.com/Boshen/oxc/issues/255

let { fuzz, minimize } = require('.');

let fs = require('fs');
let path = require('path');
let { execSync, exec } = require('child_process');

let fn = src => {
  fs.writeFileSync('__tmp.js', src, 'utf8');
  return new Promise((res, rej) => {
    exec('./oxc/target/debug/oxc __tmp.js', {}, (err, stdout, stderr) => {
      if (err == null) {
        res();
      } else {
        rej(new Error(stderr));
      }
    });
  });
};

let known = [
];

fuzz(fn, 200_000, known);
