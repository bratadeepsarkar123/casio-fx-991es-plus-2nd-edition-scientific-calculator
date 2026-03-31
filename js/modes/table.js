class TableMode {
    constructor(state) {
        this.state = state;
        this.f_x = null; // AST of f(x)
        this.g_x = null; // AST of g(x)

        this.start = 1;
        this.end = 5;
        this.step = 1;
    }

    setFunctions(f_ast, g_ast = null) {
        this.f_x = f_ast;
        this.g_x = g_ast;
    }

    setRange(start, end, step) {
        this.start = parseFloat(start);
        this.end = parseFloat(end);
        this.step = parseFloat(step);
    }

    generateTable(evaluator) {
        if (!this.f_x) throw new Error("Syntax ERROR");
        if (this.step === 0) throw new Error("Math ERROR");

        const res = [];
        let x = this.start;
        // Limit to ~30 rows as per Casio memory limits
        let count = 0;

        while (count < 30) {
            // Check condition with tiny epsilon for floating point errors
            if (this.step > 0 && x > this.end + 1e-9) break;
            if (this.step < 0 && x < this.end - 1e-9) break;

            const row = { x: x };

            this.state.vars['X'] = x;
            try {
                row.f_x = evaluator(this.f_x, this.state);
            } catch (e) {
                row.f_x = 'ERROR';
            }

            if (this.g_x) {
                try {
                    row.g_x = evaluator(this.g_x, this.state);
                } catch (e) {
                    row.g_x = 'ERROR';
                }
            }

            res.push(row);
            x += this.step;
            count++;
        }

        if (count >= 30) {
            // Depending on model, it throws Insufficient Memory Error
        }

        return res;
    }
}
module.exports = { TableMode };
