const fs = require('fs');

const bundle = fs.readFileSync('bundle.py', 'utf8');
const patched = bundle.replace(
    /files = \[\n.*?\]/s,
    `files = [
    'js/math/engine.js',
    'js/math/solvers.js',
    'js/state.js',
    'js/math/parser.js',
    'js/ui/math_editor.js',
    'js/ui/keyboard.js',
    'js/app.js'
]`
);

fs.writeFileSync('bundle.py', patched);
