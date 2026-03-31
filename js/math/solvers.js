const { Complex, evaluate } = require('./engine.js');
const { Tokenizer, Parser } = require('./parser.js');

function parseAndEval(str, state) {
    const ast = new Parser(new Tokenizer(str)).parse();
    return evaluate(ast, state);
}

function solveQuadratic(a_str, b_str, c_str, state) {
    // Edge Case 3: Quadratic solver yielding complex conjugate roots
    const a = parseAndEval(a_str, state);
    const b = parseAndEval(b_str, state);
    const c = parseAndEval(c_str, state);

    // Using quadratic formula: x = (-b +- sqrt(b^2 - 4ac)) / 2a
    // Since we support complex numbers natively in our engine, we can evaluate it
    const four = new Complex(4);
    const two = new Complex(2);

    const bSq = b.pow(new Complex(2));
    const fourAC = four.mul(a).mul(c);
    const discriminant = bSq.sub(fourAC);

    // discriminant = b^2 - 4ac
    // sqrt(discriminant)
    const sqrtD = _complexSqrt(discriminant);

    const minusB = new Complex(-b.re, -b.im);
    const twoA = two.mul(a);

    const x1 = minusB.add(sqrtD).div(twoA);
    const x2 = minusB.sub(sqrtD).div(twoA);

    return { x1, x2 };
}

function _complexSqrt(c) {
    const r = Math.sqrt(c.abs());
    const theta = c.arg() / 2;
    return Complex.fromPolar(r, theta);
}

module.exports = { solveQuadratic };
