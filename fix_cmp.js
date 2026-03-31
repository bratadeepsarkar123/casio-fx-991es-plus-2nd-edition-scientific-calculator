// The tokenizer wasn't exposing 'POLAR' and other symbols in the UI because
// it was in a separate class without fixing the class instantiation or exports.
// Let's modify index.html directly to ensure POLAR is parsed
const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// The issue is state.mode is not set globally, or shift is not toggled correctly
// Let's print out what is happening
html = html.replace("const result = evaluate(ast, state);", "const result = evaluate(ast, state); console.log('Parsed AST:', JSON.stringify(ast), 'State:', state.mode);");

fs.writeFileSync('index.html', html);
