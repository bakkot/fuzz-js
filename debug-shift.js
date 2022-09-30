'use strict';

let { minimize } = require('.');

let fs = require('fs');
let path = require('path');
let { shrink, validSubtrees } = require('shift-shrink');
let { parseSync } = require('@swc/core');
let { default: codegen } = require('shift-codegen');

let parse = src => {
  parseSync(src, { isModule: true });
};

// minimize(JSON.parse(fs.readFileSync('./shift-bugs/1.js', 'utf8')), parse);

// console.log(codegen(JSON.parse(fs.readFileSync('./_minimizer-best.js', 'utf8'))))


/*
let badTree = JSON.parse(fs.readFileSync('./_codegen-failed-tree.json', 'utf8'));

let isStillGood = tree => {
  try {
    codegen(tree);
    return false;
  } catch {
    return true;
  }
};

(async () => {
  let tree = await shrink(badTree, isStillGood, { log: console.log });
  fs.writeFileSync('./_codegen-failed-tree-min.json', JSON.stringify(tree, null, 2), 'utf8')
})();

*/

let codegenFails = tree => {
  try {
    codegen(tree);
    return false;
  } catch {
    return true;
  }
};

let goodTree = JSON.parse(fs.readFileSync('./_minimizer-best.json', 'utf8'));
let codegensButSubtreeFails = async tree => {
  try {
    codegen(tree);
    try {
      for (let subtree of validSubtrees(tree)) {
        codegen(subtree);
      }
      return false;
    } catch (e) {
      return true;
    }
  } catch {
    return false;
  }
};

(async () => {
  let tree = await shrink(goodTree, codegensButSubtreeFails, { log: console.log });
  fs.writeFileSync('./_codegen-succ-tree-min.json', JSON.stringify(tree, null, 2), 'utf8')
})();


