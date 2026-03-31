class MathError extends Error {
    constructor(message) {
        super(message);
        this.name = "MathError";
    }
}

class Complex {
    constructor(re, im = 0) {
        this.re = re;
        this.im = im;
    }

    add(c) { return new Complex(this.re + c.re, this.im + c.im); }
    sub(c) { return new Complex(this.re - c.re, this.im - c.im); }
    mul(c) { return new Complex(this.re * c.re - this.im * c.im, this.re * c.im + this.im * c.re); }
    div(c) {
        const denom = c.re * c.re + c.im * c.im;
        if (denom === 0) throw new MathError("Math ERROR");
        return new Complex((this.re * c.re + this.im * c.im) / denom, (this.im * c.re - this.re * c.im) / denom);
    }
    pow(n) {
        if (n.im === 0 && Number.isInteger(n.re) && n.re >= 0) {
            let res = new Complex(1, 0);
            for (let i = 0; i < n.re; i++) res = res.mul(this);
            return res;
        }
        if (this.re === 0 && this.im === 0) return new Complex(0, 0);
        const r = this.abs();
        const theta = this.arg();
        const ln_r = Math.log(r);
        const arg_re = n.re * ln_r - n.im * theta;
        const arg_im = n.re * theta + n.im * ln_r;
        const R = Math.exp(arg_re);
        return new Complex(R * Math.cos(arg_im), R * Math.sin(arg_im));
    }
    abs() { return Math.sqrt(this.re * this.re + this.im * this.im); }
    arg() { return Math.atan2(this.im, this.re); }

    static fromPolar(r, theta) {
        return new Complex(r * Math.cos(theta), r * Math.sin(theta));
    }

    toString() {
        let r = this.re;
        let i = this.im;
        if (Math.abs(r) < 1e-12) r = 0;
        if (Math.abs(i) < 1e-12) i = 0;
        if (i === 0) return String(r);
        if (r === 0) return `${i === 1 ? '' : i === -1 ? '-' : i}i`;
        const sign = i > 0 ? '+' : '-';
        return `${r} ${sign} ${Math.abs(i) === 1 ? '' : Math.abs(i)}i`;
    }
}

function evaluate(node, state) {
    if (!node) return new Complex(0);

    const degToRad = (deg) => state.angleMode === 'D' ? deg * Math.PI / 180 : deg;
    const radToDeg = (rad) => state.angleMode === 'D' ? rad * 180 / Math.PI : rad;

    const evalNode = (n) => evaluate(n, state);

    if (node.type === 'Number') return new Complex(node.value);

    if (node.type === 'Var') {
        if (node.name === 'i') {
            if (state.mode !== 'CMPLX' && state.mode !== 'EQN') {
                throw new MathError("Syntax ERROR"); // i only in CMPLX
            }
            return new Complex(0, 1);
        }
        if (node.name === 'pi') return new Complex(Math.PI);
        if (node.name === 'e') return new Complex(Math.E);
        if (node.name === 'Ans') return state.ans || new Complex(0);
        return state.vars[node.name] || new Complex(0);
    }

    if (node.type === 'UnaryOp') {
        const val = evalNode(node.expr);
        if (node.op === '+') return val;
        if (node.op === '-') return new Complex(-val.re, -val.im);
        if (node.op === '!') {
            if (val.im !== 0 || val.re < 0 || !Number.isInteger(val.re)) throw new MathError("Math ERROR");
            let f = 1;
            for (let i = 2; i <= val.re; i++) f *= i;
            return new Complex(f);
        }
    }

    if (node.type === 'BinaryOp') {
        const left = evalNode(node.left);
        const right = evalNode(node.right);
        if (node.op === '+') return left.add(right);
        if (node.op === '-') return left.sub(right);
        if (node.op === '*') return left.mul(right);
        if (node.op === '/') return left.div(right);
        if (node.op === '^') return left.pow(right);
        if (node.op === '∠') { // Edge Case 2 Polar Input
            if (state.mode !== 'CMPLX') throw new MathError("Syntax ERROR");
            // left ∠ right (r ∠ theta)
            if (left.im !== 0 || right.im !== 0) throw new MathError("Math ERROR");
            let r = left.re;
            let theta = right.re;
            if (state.angleMode === 'D') theta = theta * Math.PI / 180;
            return Complex.fromPolar(r, theta);
        }
    }

    if (node.type === 'Func') {
        const arg = evalNode(node.arg);
        if (node.name === 'sin') return new Complex(Math.sin(degToRad(arg.re)));
        if (node.name === 'cos') return new Complex(Math.cos(degToRad(arg.re)));
        if (node.name === 'tan') return new Complex(Math.tan(degToRad(arg.re)));
        if (node.name === 'sqrt') {
            if (arg.re < 0 && state.mode === 'COMP') throw new MathError("Math ERROR");
            const r = Math.sqrt(arg.abs());
            const theta = arg.arg() / 2;
            return Complex.fromPolar(r, theta);
        }
        if (node.name === 'ln') return new Complex(Math.log(arg.re));
        if (node.name === 'log') return new Complex(Math.log10(arg.re));
    }

    throw new Error(`Syntax ERROR: Unknown AST node type ${node.type}`);
}

module.exports = { Complex, evaluate, MathError };
