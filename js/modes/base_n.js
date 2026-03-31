class BaseNMode {
    constructor(state) {
        this.state = state;
        this.currentBase = 'DEC'; // DEC, HEX, BIN, OCT
        this.displayVal = 0;
    }

    setBase(base) {
        if (['DEC', 'HEX', 'BIN', 'OCT'].includes(base)) {
            this.currentBase = base;
            // Physical Casio typically converts the displayed value to the new base
            this.updateDisplay();
        }
    }

    parseValue(str, base) {
        str = str.replace(/[^0-9A-Fa-f\-]/g, '');
        if (!str) return 0;

        switch (base) {
            case 'DEC': return parseInt(str, 10);
            case 'HEX': return parseInt(str, 16);
            case 'BIN': return parseInt(str, 2);
            case 'OCT': return parseInt(str, 8);
        }
        return 0;
    }

    formatValue(val, base) {
        if (typeof val !== 'number' || isNaN(val)) return 'ERROR';
        // Casio truncates to 32-bit integers in BASE-N mode
        val = Math.trunc(val) | 0; // Convert to signed 32-bit integer

        let result = '';
        switch (base) {
            case 'DEC': result = val.toString(10); break;
            case 'HEX':
                result = (val >>> 0).toString(16).toUpperCase();
                if (result.length > 8) result = result.slice(-8); // 32-bit hex
                break;
            case 'BIN':
                result = (val >>> 0).toString(2);
                if (result.length > 32) result = result.slice(-32); // 32-bit bin
                break;
            case 'OCT':
                // JS converts negative numbers to signed octal (-7) instead of 2's complement octal.
                // We need 32-bit unsigned for 2's complement display in base 8
                result = (val >>> 0).toString(8);
                if (result.length > 11) result = result.slice(-11); // 32-bit octal fits in 11 chars
                break;
        }
        return result;
    }

    evaluate(astOrStr) {
        // A minimal evaluator for BASE-N which supports logic gates: AND, OR, XOR, XNOR, NOT, NEG
        // For now, assume it returns a raw number.
        // We'll plug this into the main engine or use a special evaluator.
        return 0;
    }

    updateDisplay() {
        return this.formatValue(this.displayVal, this.currentBase);
    }
}
module.exports = { BaseNMode };
