'use strict';

let fs = require('fs');
let path = require('path');

let { fuzzModule } = require('shift-fuzzer');
let { parseModule } = require('shift-parser');

let codegen = require('shift-codegen').default;
let tenko = require('tenko');

let file = path.resolve(__dirname, 'build/in.js');
// let outfile = path.resolve(__dirname, 'build/out.js');


let known = [
  'An async function expression is not allowed here',
  'because was already bound as a catch clause pattern binding', // bug in shift, allows `try{}catch([async]){var async}``
  'but another binding already existed on the same level',
  'Unable to ASI',
  'Found a var binding that is duplicate of a lexical binding on the same or lower statement level',
  'The left hand side of the arrow is not destructible',
  'A valid bracket quantifier',
  'The binding pattern is not destructible',
  'Tried to destructure something that is not destructible',
  'Encountered unescaped quantifier',
];
(async () => {
  for (let i = 0; i < 100000; ++i) {
    let tree = fuzzModule();
    let src = codegen(tree);

    try {
      parseModule(src);
    } catch (e) {
      --i;
      continue;
    }
    console.log(i);

    fs.writeFileSync(file, src, 'utf8');

    try {
      tenko(src, { goalMode: tenko.GOAL_MODULE });
    } catch (e) {
      if (known.some(m => e.message.includes(m))) {
        --i;
        continue;        
      }
      throw e;
    }
  }
})().catch(e => {
  console.log(e);
  process.exit(1)
});
