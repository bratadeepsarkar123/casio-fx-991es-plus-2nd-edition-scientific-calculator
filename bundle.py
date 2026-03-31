import re

with open("index.html", "r") as f:
    html = f.read()

# Load js files
js_code = []

files = ['state.js', 'parser.js', 'engine.js', 'solvers.js', 'main_logic.js']

for file in files:
    with open(file, "r") as f:
        content = f.read()
        content = re.sub(r'const \{.*?\} = require\(.*?\);', '', content)
        content = re.sub(r'module\.exports = \{.*?\};', '', content)
        js_code.append(content)

full_js = "\n".join(js_code)

app_js = r"""
const screenInput = document.getElementById('screen-input');
const screenResult = document.getElementById('screen-result');
const indS = document.getElementById('ind-s');
const indA = document.getElementById('ind-a');
const indCmplx = document.getElementById('ind-cmplx');

function updateScreen(resultValue = null, isError = false) {
    if (screenInput) screenInput.innerHTML = state.currentInput;
    if (resultValue !== null && screenResult) {
        screenResult.innerText = resultValue;
    } else if (screenResult) {
        screenResult.innerText = "";
    }

    if (indS) indS.classList.toggle('active', state.shift);
    if (indA) indA.classList.toggle('active', state.alpha);
    if (indCmplx) indCmplx.classList.toggle('active', state.mode === 'CMPLX');
}

function handleInput(val) {
    if (state.currentInput === '' && val !== 'Ans') {
        state.currentInput = '';
    }
    state.currentInput += val;
    updateScreen();
}

document.getElementById('btn-shift').addEventListener('click', () => { state.toggleShift(); updateScreen(); });
document.getElementById('btn-alpha').addEventListener('click', () => { state.toggleAlpha(); updateScreen(); });

for (let i = 0; i <= 9; i++) {
    const el = document.getElementById('btn-'+i);
    if(el) el.addEventListener('click', () => handleInput(i.toString()));
}
document.getElementById('btn-dot').addEventListener('click', () => handleInput('.'));
document.getElementById('btn-exp').addEventListener('click', () => handleInput('E'));
document.getElementById('btn-ans').addEventListener('click', () => handleInput('Ans'));

document.getElementById('btn-plus').addEventListener('click', () => handleInput('+'));
document.getElementById('btn-minus').addEventListener('click', () => handleInput('-'));
document.getElementById('btn-mul').addEventListener('click', () => handleInput('×'));
document.getElementById('btn-div').addEventListener('click', () => handleInput('÷'));
document.getElementById('btn-lparen').addEventListener('click', () => handleInput('('));
document.getElementById('btn-rparen').addEventListener('click', () => handleInput(')'));

document.getElementById('btn-sin').addEventListener('click', () => handleInput(state.shift ? 'asin(' : 'sin('));
document.getElementById('btn-cos').addEventListener('click', () => handleInput(state.shift ? 'acos(' : 'cos('));
document.getElementById('btn-tan').addEventListener('click', () => handleInput(state.shift ? 'atan(' : 'tan('));
document.getElementById('btn-sqrt').addEventListener('click', () => handleInput(state.shift ? '∛(' : '√('));
document.getElementById('btn-pow').addEventListener('click', () => handleInput('^'));
document.getElementById('btn-sq').addEventListener('click', () => handleInput('^2'));
document.getElementById('btn-ln').addEventListener('click', () => handleInput(state.shift ? 'e^(' : 'ln('));
document.getElementById('btn-log').addEventListener('click', () => handleInput(state.shift ? '10^(' : 'log('));

document.getElementById('btn-ac').addEventListener('click', () => {
    state.currentInput = '';
    state.ans = null; // Hard reset Ans
    updateScreen();
});

document.getElementById('btn-del').addEventListener('click', () => {
    state.currentInput = state.currentInput.slice(0, -1);
    updateScreen();
});

document.getElementById('btn-eq').addEventListener('click', () => {
    if (state.currentInput === '') {
        state.currentInput = state.lastInput || '';
    } else if (/^[\+\-\*\/×÷\^]/.test(state.currentInput)) {
        state.currentInput = 'Ans' + state.currentInput;
    }

    let parseStr = state.currentInput.replace(/×/g, '*').replace(/÷/g, '/').replace(/√/g, 'sqrt');

    try {
        const tokenizer = new Tokenizer(parseStr);
        const parser = new Parser(tokenizer);
        const ast = parser.parse();
        const result = evaluate(ast, state);

        state.ans = result;
        state.lastInput = state.currentInput;
        state.currentInput = '';

        updateScreen(result.toString());
        state.shift = false;
        state.alpha = false;
    } catch (e) {
        if (e.name === 'MathError') {
            updateScreen('Math ERROR', true);
        } else {
            console.error(e);
            updateScreen('Syntax ERROR', true);
        }
        state.shift = false;
        state.alpha = false;
        state.currentInput = '';
    }
});

document.getElementById('btn-mode').addEventListener('click', () => {
    if (state.mode === 'COMP') state.mode = 'CMPLX';
    else if (state.mode === 'CMPLX') state.mode = 'EQN';
    else state.mode = 'COMP';

    state.currentInput = '';
    updateScreen('Mode: ' + state.mode);
});

document.getElementById('btn-eng').addEventListener('click', (e) => {
    e.stopPropagation();
    if (state.mode === 'CMPLX') {
        if (state.shift) {
            handleInput('∠');
        } else {
            handleInput('i');
        }
    } else {
        handleInput(state.shift ? '←' : 'ENG');
    }
});

updateScreen();
"""

html = html.replace("// JS Logic goes here", full_js + "\n" + app_js)

with open("index.html", "w") as f:
    f.write(html)
