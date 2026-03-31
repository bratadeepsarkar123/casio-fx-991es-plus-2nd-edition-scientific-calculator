class MatrixMode {
    constructor(state) {
        this.state = state;
        this.mats = { A: null, B: null, C: null, Ans: null };
        this.currentMat = 'A';
        this.inputRow = 0;
        this.inputCol = 0;
    }

    defineMatrix(name, rows, cols) {
        if (!['A', 'B', 'C'].includes(name)) return;
        if (rows < 1 || rows > 3 || cols < 1 || cols > 3) return;

        this.mats[name] = Array(rows).fill(0).map(() => Array(cols).fill(0));
        this.currentMat = name;
        this.inputRow = 0;
        this.inputCol = 0;
    }

    inputVal(val) {
        const mat = this.mats[this.currentMat];
        if (!mat) return;

        mat[this.inputRow][this.inputCol] = parseFloat(val);
        this.inputCol++;
        if (this.inputCol >= mat[0].length) {
            this.inputCol = 0;
            this.inputRow++;
        }
    }

    // Matrix Math Operations
    add(m1, m2) {
        if (m1.length !== m2.length || m1[0].length !== m2[0].length) throw new Error("Dimension ERROR");
        return m1.map((row, i) => row.map((val, j) => val + m2[i][j]));
    }

    sub(m1, m2) {
        if (m1.length !== m2.length || m1[0].length !== m2[0].length) throw new Error("Dimension ERROR");
        return m1.map((row, i) => row.map((val, j) => val - m2[i][j]));
    }

    mul(m1, m2) {
        // scalar mult
        if (typeof m1 === 'number') return m2.map(row => row.map(v => v * m1));
        if (typeof m2 === 'number') return m1.map(row => row.map(v => v * m2));

        if (m1[0].length !== m2.length) throw new Error("Dimension ERROR");
        const res = Array(m1.length).fill(0).map(() => Array(m2[0].length).fill(0));

        for (let i = 0; i < m1.length; i++) {
            for (let j = 0; j < m2[0].length; j++) {
                for (let k = 0; k < m1[0].length; k++) {
                    res[i][j] += m1[i][k] * m2[k][j];
                }
            }
        }
        return res;
    }

    det(m) {
        if (m.length !== m[0].length) throw new Error("Dimension ERROR");
        if (m.length === 1) return m[0][0];
        if (m.length === 2) return m[0][0]*m[1][1] - m[0][1]*m[1][0];
        if (m.length === 3) {
            return m[0][0]*(m[1][1]*m[2][2] - m[1][2]*m[2][1]) -
                   m[0][1]*(m[1][0]*m[2][2] - m[1][2]*m[2][0]) +
                   m[0][2]*(m[1][0]*m[2][1] - m[1][1]*m[2][0]);
        }
        throw new Error("Math ERROR");
    }

    inv(m) {
        const d = this.det(m);
        if (d === 0) throw new Error("Math ERROR");

        if (m.length === 1) return [[1/m[0][0]]];
        if (m.length === 2) return [
            [m[1][1]/d, -m[0][1]/d],
            [-m[1][0]/d, m[0][0]/d]
        ];
        if (m.length === 3) {
            return [
                [(m[1][1]*m[2][2] - m[1][2]*m[2][1])/d, -(m[0][1]*m[2][2] - m[0][2]*m[2][1])/d, (m[0][1]*m[1][2] - m[0][2]*m[1][1])/d],
                [-(m[1][0]*m[2][2] - m[1][2]*m[2][0])/d, (m[0][0]*m[2][2] - m[0][2]*m[2][0])/d, -(m[0][0]*m[1][2] - m[0][2]*m[1][0])/d],
                [(m[1][0]*m[2][1] - m[1][1]*m[2][0])/d, -(m[0][0]*m[2][1] - m[0][1]*m[2][0])/d, (m[0][0]*m[1][1] - m[0][1]*m[1][0])/d]
            ];
        }
    }

    trns(m) {
        return m[0].map((_, colIndex) => m.map(row => row[colIndex]));
    }
}
module.exports = { MatrixMode };
