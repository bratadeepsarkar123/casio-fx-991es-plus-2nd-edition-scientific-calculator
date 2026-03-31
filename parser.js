// Token types
const T = {
    NUMBER: 'NUMBER',
    PLUS: 'PLUS',
    MINUS: 'MINUS',
    MUL: 'MUL',
    DIV: 'DIV',
    POW: 'POW',
    LPAREN: 'LPAREN',
    RPAREN: 'RPAREN',
    FUNC: 'FUNC', // sin, cos, etc.
    VAR: 'VAR',   // x, A, B, Ans, pi, e
    IMPLICIT_MUL: 'IMPLICIT_MUL',
    EOF: 'EOF',
    POLAR: 'POLAR', // ∠
    SQRT: 'SQRT',
    CBRT: 'CBRT',
    FACT: 'FACT'
};

class Tokenizer {
    constructor(input) {
        this.input = input;
        this.pos = 0;
        this.current = null;
        this.advance();
    }

    advance() {
        while (this.pos < this.input.length && /\s/.test(this.input[this.pos])) {
            this.pos++;
        }

        if (this.pos >= this.input.length) {
            this.current = { type: T.EOF, value: null };
            return;
        }

        const char = this.input[this.pos];

        if (/[0-9.]/.test(char)) {
            let numStr = '';
            let hasDot = false;
            while (this.pos < this.input.length && /[0-9.]/.test(this.input[this.pos])) {
                if (this.input[this.pos] === '.') {
                    if (hasDot) break; // invalid, but let parser handle
                    hasDot = true;
                }
                numStr += this.input[this.pos];
                this.pos++;
            }
            this.current = { type: T.NUMBER, value: numStr };
            return;
        }

        if (/[a-zA-Z]/.test(char)) {
            let ident = '';
            while (this.pos < this.input.length && /[a-zA-Z]/.test(this.input[this.pos])) {
                ident += this.input[this.pos];
                this.pos++;
            }

            // Map identifiers
            const funcs = ['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'log', 'ln', 'sqrt', 'cbrt'];
            const vars = ['A', 'B', 'C', 'D', 'E', 'F', 'X', 'Y', 'M', 'Ans', 'pi', 'e', 'i'];

            if (funcs.includes(ident)) {
                this.current = { type: T.FUNC, value: ident };
            } else if (vars.includes(ident)) {
                this.current = { type: T.VAR, value: ident };
            } else {
                // Unknown, treat as individual vars implicitly multiplied (e.g., AB -> A * B)
                // For simplicity in this parser, we assume standard variables.
                // We'll treat the first char as VAR and backtrack.
                this.pos -= (ident.length - 1);
                this.current = { type: T.VAR, value: ident[0] };
            }
            return;
        }

        // Single character tokens
        this.pos++;
        switch (char) {
            case '+': this.current = { type: T.PLUS, value: '+' }; break;
            case '-': this.current = { type: T.MINUS, value: '-' }; break;
            case '×':
            case '*': this.current = { type: T.MUL, value: '*' }; break;
            case '÷':
            case '/': this.current = { type: T.DIV, value: '/' }; break;
            case '^': this.current = { type: T.POW, value: '^' }; break;
            case '(': this.current = { type: T.LPAREN, value: '(' }; break;
            case ')': this.current = { type: T.RPAREN, value: ')' }; break;
            case '∠': this.current = { type: T.POLAR, value: '∠' }; break;
            case '√': this.current = { type: T.SQRT, value: '√' }; break;
            case '∛': this.current = { type: T.CBRT, value: '∛' }; break;
            case '!': this.current = { type: T.FACT, value: '!' }; break;
            default: throw new Error(`Syntax ERROR: Unknown character ${char}`);
        }
    }
}

class Parser {
    constructor(tokenizer) {
        this.tokenizer = tokenizer;
    }

    eat(type) {
        if (this.tokenizer.current.type === type) {
            this.tokenizer.advance();
        } else {
            // Edge Case 5: Auto-close parens at EOF
            if (this.tokenizer.current.type === T.EOF && type === T.RPAREN) {
                // Automatically "eat" the missing paren and do not throw
                return;
            }
            throw new Error(`Syntax ERROR: Expected ${type}, got ${this.tokenizer.current.type}`);
        }
    }

    parse() {
        const result = this.expr();
        if (this.tokenizer.current.type !== T.EOF) {
            throw new Error("Syntax ERROR: Unexpected token at end");
        }
        return result;
    }

    // + and -
    expr() {
        let node = this.term();

        while (this.tokenizer.current.type === T.PLUS || this.tokenizer.current.type === T.MINUS) {
            const token = this.tokenizer.current;
            this.eat(token.type);
            node = {
                type: 'BinaryOp',
                op: token.value,
                left: node,
                right: this.term()
            };
        }
        return node;
    }

    // Explicit * and /
    term() {
        let node = this.implicitTerm();

        while (this.tokenizer.current.type === T.MUL || this.tokenizer.current.type === T.DIV) {
            const token = this.tokenizer.current;
            this.eat(token.type);
            node = {
                type: 'BinaryOp',
                op: token.value,
                left: node,
                right: this.implicitTerm()
            };
        }
        return node;
    }

    // Edge Case 1: Implicit Multiplication binds tighter than explicit Division!
    // Example: 1 / 2π -> 1 / (2 * π)
    implicitTerm() {
        let node = this.factor();

        // What can implicitly multiply a node?
        // A NUMBER, VAR, FUNC, LPAREN, SQRT
        while (
            this.tokenizer.current.type === T.NUMBER ||
            this.tokenizer.current.type === T.VAR ||
            this.tokenizer.current.type === T.FUNC ||
            this.tokenizer.current.type === T.LPAREN ||
            this.tokenizer.current.type === T.SQRT
        ) {
            node = {
                type: 'BinaryOp',
                op: '*',
                implicit: true,
                left: node,
                right: this.factor()
            };
        }
        return node;
    }

    // Unary +, -, powers, factorials, polars
    factor() {
        let node = this.base();

        while (this.tokenizer.current.type === T.POW || this.tokenizer.current.type === T.POLAR) {
            const token = this.tokenizer.current;
            this.eat(token.type);
            node = {
                type: 'BinaryOp',
                op: token.value, // ^ or ∠
                left: node,
                right: this.factor() // right-associative for powers usually, Casio uses it
            };
        }

        // Postfix operations
        while (this.tokenizer.current.type === T.FACT) {
            this.eat(T.FACT);
            node = {
                type: 'UnaryOp',
                op: '!',
                expr: node
            };
        }

        return node;
    }

    base() {
        const token = this.tokenizer.current;

        if (token.type === T.PLUS) {
            this.eat(T.PLUS);
            return { type: 'UnaryOp', op: '+', expr: this.factor() };
        }
        if (token.type === T.MINUS) {
            this.eat(T.MINUS);
            return { type: 'UnaryOp', op: '-', expr: this.factor() };
        }
        if (token.type === T.NUMBER) {
            this.eat(T.NUMBER);
            return { type: 'Number', value: parseFloat(token.value) };
        }
        if (token.type === T.VAR) {
            this.eat(T.VAR);
            return { type: 'Var', name: token.value };
        }
        if (token.type === T.LPAREN) {
            this.eat(T.LPAREN);
            const node = this.expr();
            this.eat(T.RPAREN); // This will auto-close if at EOF
            return node;
        }
        if (token.type === T.FUNC) {
            this.eat(T.FUNC);
            // Casio auto-opens parens for functions like sin(.
            // In our token stream, if user typed sin(30), we parse the (
            // If they typed sin 30, we just parse the factor.
            let arg;
            if (this.tokenizer.current.type === T.LPAREN) {
                this.eat(T.LPAREN);
                arg = this.expr();
                this.eat(T.RPAREN);
            } else {
                arg = this.factor();
            }
            return { type: 'Func', name: token.value, arg: arg };
        }
        if (token.type === T.SQRT) {
            this.eat(T.SQRT);
            return { type: 'Func', name: 'sqrt', arg: this.factor() };
        }

        throw new Error(`Syntax ERROR: Unexpected token ${token.type} (${token.value})`);
    }
}

module.exports = { Tokenizer, Parser };
