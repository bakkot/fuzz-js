'use strict';
let fs = require('fs');
let path = require('path');
let src = fs.readFileSync('build/in.js', 'utf8');
let { parseModule } = require('shift-parser');
let codegen = require('shift-codegen').default;
let esbuild = require('esbuild');

let minimize = require('./minimize.js');

let minfile = 'build/min.js';
let outfile = path.resolve(__dirname, 'build/min-out.js');

let known = [
  'Cannot access "arguments" here',
  'has already been declared',
  'Invalid assignment target',
  'Unexpected "," after rest pattern',
  'Unexpected "("',
  'Unexpected "**"',
  'Expected "}" but found "in"',
];

let isStillGood = async tree => {
  let src = codegen(tree);
  fs.writeFileSync(minfile, src, 'utf8');
  try {
    await esbuild.build({
      entryPoints: [minfile],
      bundle: false,
      outfile,
      logLevel: 'silent',
    });
    return false;
  } catch (e) {
    if (known.some(m => e.message.includes(m))) {
      return false;
    }
    return true;
  }
};

(async () => {
  let shrunk = await minimize(parseModule(src), isStillGood, console.log);

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
