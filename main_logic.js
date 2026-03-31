const { CalculatorState } = require('./state.js');
const { Tokenizer, Parser } = require('./parser.js');
const { evaluate, MathError } = require('./engine.js');
const { solveQuadratic } = require('./solvers.js');

const state = new CalculatorState();

// Edge Case 4: The Ans Looping Logic
function handleEquals(state) {
    if (state.currentInput.trim() === '') {
        // If input is empty, reuse last input
        if (state.lastInput !== '') {
            state.currentInput = state.lastInput;
            // The physical casio doesn't visibly prepend "Ans" if you just press '=',
            // it just evaluates the last expression again. But if the last expression was "+ 1",
            // the tokenizer will see "+ 1" and fail unless it expects an operand.
            // Wait, the real Casio: if you type "1 =", then "+ 1 =", the input is "Ans+1".
            // If you just hit "=", it re-evaluates "Ans+1".
            // So if currentInput is empty, we just copy lastInput.
        } else {
            return;
        }
    } else {
        // Check if it starts with an operator (+, -, *, /) and prepend Ans implicitly
        if (/^[\+\-\*\/×÷\^]/.test(state.currentInput)) {
            state.currentInput = 'Ans' + state.currentInput;
        }
    }

    try {
        const tokenizer = new Tokenizer(state.currentInput);
        const parser = new Parser(tokenizer);
        const ast = parser.parse();

        const result = evaluate(ast, state);

        // Update Ans
        state.ans = result;
        state.lastInput = state.currentInput; // Store for loop
        state.currentInput = ''; // Clear for next fresh input

        return { success: true, value: result.toString(), displayInput: state.lastInput };

    } catch (e) {
        if (e.name === 'MathError') {
            return { success: false, value: 'Math ERROR', displayInput: state.currentInput };
        } else {
            return { success: false, value: 'Syntax ERROR', displayInput: state.currentInput };
        }
    }
}

module.exports = { handleEquals, state };
