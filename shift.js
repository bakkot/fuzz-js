let fs = require('fs');
let src = fs.readFileSync('build/in.js', 'utf8');
let { parseModule } = require('shift-parser');
let codegen = require('shift-codegen').default;

let minimize = require('./minimize.js');


// let isStillGood = tree => {
//   try {
//     let src = codegen(tree);
//     if (!src.includes('class async{}function*async(){}')) {
//       return false;
//     }
//     parseModule(src);
//     return true;
//   } catch (e) {
//     return false;
//   }
// };

// (async () => {
//   let shrunk = await minimize(parseModule(src), isStillGood, console.log);

//   console.log(shrunk);

//   console.log(codegen(shrunk));

// })().catch(e => {
//   console.error(e);
//   process.error(1);
// });

parseModule(`
'use strict';
function f(){let a;function a(){}}
`);
