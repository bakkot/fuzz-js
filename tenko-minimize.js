'use strict';
let fs = require('fs');
let path = require('path');
let src = fs.readFileSync('build/in.js', 'utf8');
let { parseModule } = require('shift-parser');
let codegen = require('shift-codegen').default;
let tenko = require('tenko');

let minimize = require('./minimize.js');

let minfile = 'build/min.js';
let outfile = path.resolve(__dirname, 'build/min-out.js');

let known = [
  'An async function expression is not allowed here',
  'because was already bound as a catch clause pattern binding', // bug in shift-parser
  'Not configured to parse `return` statement in global', // bug in minimizer
  'but another binding already existed on the same level', // bug in shift-fuzzer
  'Unable to ASI',
  'Found a var binding that is duplicate of a lexical binding on the same or lower statement level', // bug in shift-fuzzer
  'The left hand side of the arrow is not destructible',
  'A valid bracket quantifier',
  'The binding pattern is not destructible',
  'Tried to destructure something that is not destructible',
  'Encountered unescaped quantifier',
];

let isStillGood = async tree => {
  let src = codegen(tree);
  try {
    tenko(src, { goalMode: tenko.GOAL_MODULE });
    return false;
  } catch (e) {
    if (known.some(m => e.message.includes(m))) {
      return false;
    }
    return true;
  }
};

(async () => {
  let shrunk = await minimize(parseModule(src), isStillGood, { log: console.log });

  console.log(shrunk);

  console.log(codegen(shrunk));

})().catch(e => {
  console.error(e);
  process.error(1);
});

// parseModule(`
// 'use strict';
// function f(){let a;function a(){}}
// `);
