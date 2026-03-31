const { solveQuadratic } = require('./solvers.js');

try {
    const state = { mode: 'EQN', angleMode: 'D', vars: {} };
    const { x1, x2 } = solveQuadratic("1", "2", "5", state);
    console.log(`x1 = ${x1.toString()}`);
    console.log(`x2 = ${x2.toString()}`);

    // Check with floating point tolerance
    const epsilon = 1e-10;
    if (Math.abs(x1.re - (-1)) < epsilon && Math.abs(x1.im - 2) < epsilon &&
        Math.abs(x2.re - (-1)) < epsilon && Math.abs(x2.im - (-2)) < epsilon) {
        console.log("Edge Case 3 Passed: Complex conjugate roots extracted correctly.");
    } else {
        console.error("Failed Edge Case 3");
    }
} catch (e) {
    console.error(e);
}
