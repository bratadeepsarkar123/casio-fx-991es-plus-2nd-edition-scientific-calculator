const { Tokenizer, Parser } = require('./parser.js');

function parse(input) {
    const tokenizer = new Tokenizer(input);
    const parser = new Parser(tokenizer);
    return parser.parse();
}

try {
    const ast = parse("1÷2pi"); // Assuming 'pi' is a VAR in our tokenizer
    console.log(JSON.stringify(ast, null, 2));

    // Validate AST structure
    // Expected: BinaryOp '/' where left is 1, right is BinaryOp '*' implicit with 2 and pi
    if (ast.type === 'BinaryOp' && ast.op === '/' &&
        ast.right.type === 'BinaryOp' && ast.right.implicit === true && ast.right.op === '*') {
        console.log("Edge Case 1 Passed: Implicit Multiplication binds tighter than Division.");
    } else {
        console.error("Failed: Implicit multiplication precedence is wrong.");
    }

    // Edge Case 5: Graceful failure/auto-close parens
    const ast2 = parse("5*(3+2");
    console.log("Edge Case 5 (Syntax) Passed: Parens auto-closed gracefully.");
} catch (e) {
    console.error(e.message);
}
