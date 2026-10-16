// Comprueba que todas las notas usadas en la partitura existen en NOTE (y sus octavas graves de lowT).
// Uso:  node notas.js ruta/a/_all.js   (el _all.js lo genera build.py en dist/)
const src = require('fs').readFileSync(process.argv[2], 'utf8');
eval(src.match(/const NOTE = \{[^}]*\}/)[0].replace('const NOTE', 'global.NOTE'));
for (const m of src.matchAll(/Object.assign\(NOTE, \{[^}]*\}\)/g)) eval(m[0]);
const used = new Set([...src.matchAll(/'([A-G][sb]?\d)'/g)].map(x => x[1]));
const missing = [...used].filter(n => !(n in NOTE));
console.log(missing.length ? 'FALTAN: ' + missing.join(', ') : 'todas las notas existen');
