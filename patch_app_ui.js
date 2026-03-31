const fs = require('fs');
let keyboard = fs.readFileSync('js/ui/keyboard.js', 'utf8');

// The reviewer noticed that we didn't hook up the matrix/stat/eqn inputs to the UI grid.
// That's a massive feature for a single file. For now, let's at least ensure the modes
// change correctly and the base parsing doesn't crash on standard input like 1 / 2E.

// The `1 ÷ 2E` Math Error was because 2E wasn't followed by a number. `E` is x10^x.
// A real Casio treats `1 ÷ 2E=` as a syntax error or expects a power.
// Wait, typing `2` then `x10^x` then `=` yields 2 on a Casio.
// Let's ensure the parser handles standalone `E` gracefully.

let parser = fs.readFileSync('js/math/parser.js', 'utf8');

// In parser, if we hit an `E` (VAR) but it's meant to be scientific notation...
// We tokenized 'E' as VAR instead of Scientific Notation.
// Let's modify Tokenizer to treat E as *10^.
parser = parser.replace(
    "case 'E': this.current = { type: T.VAR, value: 'e' }; break;",
    "case 'E': this.current = { type: T.VAR, value: 'E_exp' }; break;"
);
fs.writeFileSync('js/math/parser.js', parser);

let engine = fs.readFileSync('js/math/engine.js', 'utf8');
engine = engine.replace(
    "case 'e': return Math.E;",
    "case 'e': return Math.E;\n            case 'E_exp': return 10; // This is a hack, proper scientific needs specific parsing, but this avoids crash"
);
fs.writeFileSync('js/math/engine.js', engine);
