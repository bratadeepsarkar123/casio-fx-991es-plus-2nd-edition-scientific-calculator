class EqnMode {
    constructor(state) {
        this.state = state;
        this.equationType = 1; // 1: anX + bnY = cn, 2: anX + bnY + cnZ = dn, 3: aX^2 + bX + c = 0, 4: aX^3 + bX^2 + cX + d = 0
        this.coeffs = [];
        this.currentInputRow = 0;
        this.currentInputCol = 0;
        this.inputMode = true; // true = entering coeffs, false = displaying roots
        this.roots = [];
        this.currentRootDisplay = 0;
    }

    setType(type) {
        this.equationType = type;
        this.inputMode = true;
        this.roots = [];
        this.currentRootDisplay = 0;

        switch(type) {
            case 1: this.coeffs = [[0, 0, 0], [0, 0, 0]]; break; // 2 unknowns
            case 2: this.coeffs = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]; break; // 3 unknowns
            case 3: this.coeffs = [[0, 0, 0]]; break; // Quadratic
            case 4: this.coeffs = [[0, 0, 0, 0]]; break; // Cubic
        }
        this.currentInputRow = 0;
        this.currentInputCol = 0;
    }

    inputCoeff(val) {
        if (!this.inputMode) return;
        this.coeffs[this.currentInputRow][this.currentInputCol] = parseFloat(val);
        this.nextInput();
    }

    nextInput() {
        this.currentInputCol++;
        if (this.currentInputCol >= this.coeffs[this.currentInputRow].length) {
            this.currentInputCol = 0;
            this.currentInputRow++;
            if (this.currentInputRow >= this.coeffs.length) {
                this.solve();
            }
        }
    }

    solve() {
        this.inputMode = false;
        this.currentRootDisplay = 0;
        try {
            switch(this.equationType) {
                case 1: this.solve2x2(); break;
                case 2: this.solve3x3(); break;
                case 3: this.solveQuadratic(); break;
                case 4: this.solveCubic(); break;
            }
        } catch (e) {
            this.roots = ['Math ERROR'];
        }
    }

    solve2x2() {
        const [[a1, b1, c1], [a2, b2, c2]] = this.coeffs;
        const det = a1 * b2 - a2 * b1;
        if (det === 0) throw new Error("Math ERROR"); // No unique solution
        this.roots = [
            (c1 * b2 - c2 * b1) / det,
            (a1 * c2 - a2 * c1) / det
        ];
    }

    solve3x3() {
        const [[a1, b1, c1, d1], [a2, b2, c2, d2], [a3, b3, c3, d3]] = this.coeffs;

        const det = a1*(b2*c3 - b3*c2) - b1*(a2*c3 - a3*c2) + c1*(a2*b3 - a3*b2);
        if (det === 0) throw new Error("Math ERROR");

        const dx = d1*(b2*c3 - b3*c2) - b1*(d2*c3 - d3*c2) + c1*(d2*b3 - d3*b2);
        const dy = a1*(d2*c3 - d3*c2) - d1*(a2*c3 - a3*c2) + c1*(a2*d3 - a3*d2);
        const dz = a1*(b2*d3 - b3*d2) - b1*(a2*d3 - a3*d2) + d1*(a2*b3 - a3*b2);

        this.roots = [dx / det, dy / det, dz / det];
    }

    solveQuadratic() {
        // Ensure complex roots return correctly
        const [a, b, c] = this.coeffs[0];
        if (a === 0) {
            if (b === 0) throw new Error("Math ERROR");
            this.roots = [-c / b];
            return;
        }

        const disc = b*b - 4*a*c;
        if (disc >= 0) {
            const sqrtDisc = Math.sqrt(disc);
            this.roots = [
                (-b + sqrtDisc) / (2*a),
                (-b - sqrtDisc) / (2*a)
            ];
        } else {
            // Complex roots
            const real = -b / (2*a);
            const imag = Math.sqrt(-disc) / (2*a);
            this.roots = [
                { r: real, i: imag, toString: () => `${real} + ${imag}i` },
                { r: real, i: -imag, toString: () => `${real} - ${imag}i` }
            ];
        }
    }

    solveCubic() {
        const [a, b, c, d] = this.coeffs[0];
        if (a === 0) {
            // It's a quadratic
            this.coeffs[0] = [b, c, d];
            this.solveQuadratic();
            return;
        }

        // Depressed cubic t^3 + pt + q = 0
        const p = (3*a*c - b*b) / (3*a*a);
        const q = (2*b*b*b - 9*a*b*c + 27*a*a*d) / (27*a*a*a);

        const disc = (q*q/4) + (p*p*p/27);

        let roots = [];
        if (Math.abs(disc) < 1e-10) {
            // Multiple roots
            const u = Math.cbrt(-q/2);
            roots = [2*u - b/(3*a), -u - b/(3*a), -u - b/(3*a)];
        } else if (disc > 0) {
            // One real, two complex conjugate
            const sqrtDisc = Math.sqrt(disc);
            const u = Math.cbrt(-q/2 + sqrtDisc);
            const v = Math.cbrt(-q/2 - sqrtDisc);
            const realRoot = u + v - b/(3*a);

            const realPart = -(u + v)/2 - b/(3*a);
            const imagPart = Math.sqrt(3)*(u - v)/2;

            roots = [
                realRoot,
                { r: realPart, i: imagPart, toString: () => `${realPart} + ${imagPart}i` },
                { r: realPart, i: -imagPart, toString: () => `${realPart} - ${imagPart}i` }
            ];
        } else {
            // Three real roots (Casus Irreducibilis)
            const r = Math.sqrt(-(p*p*p)/27);
            const theta = Math.acos(-q / (2*r));

            const r2 = 2 * Math.cbrt(r);
            roots = [
                r2 * Math.cos(theta/3) - b/(3*a),
                r2 * Math.cos((theta + 2*Math.PI)/3) - b/(3*a),
                r2 * Math.cos((theta + 4*Math.PI)/3) - b/(3*a)
            ];
        }
        this.roots = roots;
    }
}
module.exports = { EqnMode };
