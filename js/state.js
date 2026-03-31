// state.js
class CalculatorState {
    constructor() {
        this.mode = 'COMP'; // COMP, CMPLX, STAT, BASE-N, EQN, MATRIX, TABLE, VECTOR
        this.baseN = null;
        this.eqn = null;
        this.stat = null;
        this.matrix = null;
        this.vector = null;
        this.table = null;
        this.angleMode = 'D'; // D, R, G
        this.shift = false;
        this.alpha = false;
        this.ans = null; // Stored Complex object
        this.vars = {
            'A': null, 'B': null, 'C': null, 'D': null, 'E': null, 'F': null,
            'X': null, 'Y': null, 'M': null
        };
        this.currentInput = "";
        this.lastInput = ""; // Used for Ans loop
    }

    toggleShift() {
        this.shift = !this.shift;
        if (this.shift) this.alpha = false;
    }

    toggleAlpha() {
        this.alpha = !this.alpha;
        if (this.alpha) this.shift = false;
    }

    resetModifiers() {
        this.shift = false;
        this.alpha = false;
    }

    appendInput(str) {
        this.currentInput += str;
    }

    deleteInput() {
        if (this.currentInput.length > 0) {
            this.currentInput = this.currentInput.slice(0, -1);
        }
    }

    clearInput() {
        this.currentInput = "";
    }
}
module.exports = { CalculatorState };
