class VectorMode {
    constructor(state) {
        this.state = state;
        this.vecs = { A: null, B: null, C: null, Ans: null };
        this.currentVec = 'A';
        this.inputIndex = 0;
    }

    defineVector(name, dim) {
        if (!['A', 'B', 'C'].includes(name)) return;
        if (dim !== 2 && dim !== 3) return;

        this.vecs[name] = Array(dim).fill(0);
        this.currentVec = name;
        this.inputIndex = 0;
    }

    inputVal(val) {
        const vec = this.vecs[this.currentVec];
        if (!vec) return;

        vec[this.inputIndex] = parseFloat(val);
        this.inputIndex++;
    }

    add(v1, v2) {
        if (v1.length !== v2.length) throw new Error("Dimension ERROR");
        return v1.map((val, i) => val + v2[i]);
    }

    sub(v1, v2) {
        if (v1.length !== v2.length) throw new Error("Dimension ERROR");
        return v1.map((val, i) => val - v2[i]);
    }

    dot(v1, v2) {
        if (v1.length !== v2.length) throw new Error("Dimension ERROR");
        return v1.reduce((sum, val, i) => sum + val * v2[i], 0);
    }

    cross(v1, v2) {
        if (v1.length !== 3 || v2.length !== 3) throw new Error("Dimension ERROR");
        return [
            v1[1]*v2[2] - v1[2]*v2[1],
            v1[2]*v2[0] - v1[0]*v2[2],
            v1[0]*v2[1] - v1[1]*v2[0]
        ];
    }
}
module.exports = { VectorMode };
