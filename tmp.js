// let { parseSync } = require('@swc/core');

//   let old = process.stderr.write;

//   process.stderr.write = (string, encoding, fd) => {
//     // console.log('wrapped', string);
//   };

//   console.error('xxxx')

//   try {
//     parseSync('x y', { isModule: true });
//   } finally {
//     process.stderr.write = old;
//   }


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



parse('{ {} {} /a/ }').then(console.log, console.error);
