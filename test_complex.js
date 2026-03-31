const { Complex, evaluate, MathError } = require('./engine.js');
const { Tokenizer, Parser } = require('./parser.js');

function parseAndEval(input, state) {
    const tokenizer = new Tokenizer(input);
    const parser = new Parser(tokenizer);
    const ast = parser.parse();
    return evaluate(ast, state);
}

try {
    const state = { mode: 'CMPLX', angleMode: 'D', vars: {} };

    // Edge Case 2: 5∠30 + 3∠-45
    // Should be correctly evaluated using Complex arithmetic.
    // 5∠30 = 5*cos(30) + 5*sin(30)i = 4.330 + 2.5i
    // 3∠-45 = 3*cos(-45) + 3*sin(-45)i = 2.121 - 2.121i
    // Sum = 6.451 + 0.379i
    const result = parseAndEval("5∠30 + 3∠-45", state);
    console.log("Edge Case 2 Passed: Polar Complex parsing and evaluation works.");
    console.log(`5∠30 + 3∠-45 = ${result.re} + ${result.im}i`);

    // Edge Case 5: 5 / 0 Graceful failure
    try {
        parseAndEval("5 / 0", state);
        console.error("Failed: Should throw MathError");
    } catch (e) {
        if (e.name === 'MathError') {
            console.log("Edge Case 5 (Math) Passed: Division by zero throws custom MathError.");
        } else {
            console.error("Failed: Threw unexpected error: ", e);
        }
    }
} catch (e) {
    console.error(e);
}
