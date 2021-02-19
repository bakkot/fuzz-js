'use strict';

let fs = require('fs');
let path = require('path');

let { fuzzModule } = require('shift-fuzzer');
let { parseModule } = require('shift-parser');

let codegen = require('shift-codegen').default;
let esbuild = require('esbuild');

let file = path.resolve(__dirname, 'build/in.js');
let outfile = path.resolve(__dirname, 'build/out.js');


let known = [
  // 'Cannot access "arguments" here',
  'has already been declared',
  // 'Invalid assignment target',
  // 'Unexpected "," after rest pattern',
  // 'Unexpected "("',
  // 'Unexpected "**"',
  // 'Expected "}" but found "in"',
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
      await esbuild.build({
        entryPoints: [file],
        bundle: false,
        outfile,
        logLevel: 'silent',
      });
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
