class StatMode {
    constructor(state) {
        this.state = state;
        this.type = 1; // 1: 1-VAR, 2: A+BX, 3: _+CX^2, etc.
        this.data = []; // array of {x, y, freq}
        this.freqOn = false;

        // Sums
        this.n = 0;
        this.sumX = 0;
        this.sumX2 = 0;
        this.sumY = 0;
        this.sumY2 = 0;
        this.sumXY = 0;
        this.sumX3 = 0;
        this.sumX2Y = 0;
        this.sumX4 = 0;
    }

    setType(type) {
        this.type = type;
        this.clearData();
    }

    clearData() {
        this.data = [];
        this.n = 0;
        this.sumX = 0;
        this.sumX2 = 0;
        this.sumY = 0;
        this.sumY2 = 0;
        this.sumXY = 0;
        this.sumX3 = 0;
        this.sumX2Y = 0;
        this.sumX4 = 0;
    }

    addData(x, y = 0, freq = 1) {
        if (!this.freqOn) freq = 1;
        this.data.push({x, y, freq});

        this.n += freq;
        this.sumX += x * freq;
        this.sumX2 += x*x * freq;

        if (this.type > 1) {
            this.sumY += y * freq;
            this.sumY2 += y*y * freq;
            this.sumXY += x*y * freq;

            if (this.type === 3) { // Quadratic
                this.sumX3 += x*x*x * freq;
                this.sumX2Y += x*x*y * freq;
                this.sumX4 += x*x*x*x * freq;
            }
        }
    }

    meanX() { return this.sumX / this.n; }
    meanY() { return this.sumY / this.n; }

    sx() { return Math.sqrt((this.sumX2 - (this.sumX*this.sumX)/this.n) / (this.n - 1)); }
    sigmax() { return Math.sqrt((this.sumX2 - (this.sumX*this.sumX)/this.n) / this.n); }

    sy() { return Math.sqrt((this.sumY2 - (this.sumY*this.sumY)/this.n) / (this.n - 1)); }
    sigmay() { return Math.sqrt((this.sumY2 - (this.sumY*this.sumY)/this.n) / this.n); }

    // Regression A+BX
    regA() {
        const mx = this.meanX();
        const my = this.meanY();
        const b = this.regB();
        return my - b * mx;
    }

    regB() {
        const num = this.sumXY - (this.sumX * this.sumY) / this.n;
        const den = this.sumX2 - (this.sumX * this.sumX) / this.n;
        return num / den;
    }

    regR() {
        const num = this.sumXY - (this.sumX * this.sumY) / this.n;
        const denX = this.sumX2 - (this.sumX * this.sumX) / this.n;
        const denY = this.sumY2 - (this.sumY * this.sumY) / this.n;
        return num / Math.sqrt(denX * denY);
    }
}
module.exports = { StatMode };
