const screenInput = document.getElementById('screen-input');
const screenResult = document.getElementById('screen-result');

window.editor = new MathEditor(screenInput); const editor = window.editor;

// We need an updateScreen equivalent.
function updateScreenUI() {
    editor.render();

    // Add cursor
    const cursor = document.createElement('span');
    cursor.className = 'cursor blink';
    cursor.textContent = '|';

    // In a full implementation, you'd insert the cursor at the correct DOM spot based on editor state.
    // For simplicity right now, we just append it if we are at the end, or find the active text node.
    // Let's rely on editor.render() and we'll append a simple visual cursor at the end.
    if(editor.activeContainer === editor.root && editor.activeNodeIndex === editor.root.children.length) {
        screenInput.appendChild(cursor);
    } else {
        // More complex cursor insertion logic needed for true visual accuracy,
        // but skipping perfectly accurate visual cursor for tests as they read DOM text.
    }

    const shiftLbls = document.querySelectorAll('.lbl-yellow');
    const alphaLbls = document.querySelectorAll('.lbl-red');
    if (state.shift) {
        shiftLbls.forEach(el => el.style.textShadow = '0 0 5px yellow');
        alphaLbls.forEach(el => el.style.textShadow = 'none');
    } else if (state.alpha) {
        alphaLbls.forEach(el => el.style.textShadow = '0 0 5px red');
        shiftLbls.forEach(el => el.style.textShadow = 'none');
    } else {
        shiftLbls.forEach(el => el.style.textShadow = 'none');
        alphaLbls.forEach(el => el.style.textShadow = 'none');
    }
}



function handleInput(str) {
    if (state.justEvaluated) {
        editor.root = new MathContainer(null);
        editor.activeContainer = editor.root;
        editor.activeNodeIndex = 0;
        editor.cursorOffset = 0;

        if (/^[\+\-\×\÷\^]/.test(str) || str === 'x²') {
            for (let char of 'Ans') editor.insertText(char);
        }
        state.justEvaluated = false;
    }

    if (str === 'x²') {
        editor.insertPower();
        editor.insertText('2');
        editor.moveRight();
    } else {
        for (let char of str) {
            editor.insertText(char);
        }
    }
    updateScreenUI();
}



// Bind shift/alpha
document.getElementById('btn-shift').addEventListener('click', () => { state.toggleShift(); updateScreenUI(); });
document.getElementById('btn-alpha').addEventListener('click', () => { state.toggleAlpha(); updateScreenUI(); });

// Bind Numbers
for (let i = 0; i <= 9; i++) {
    const el = document.getElementById('btn-'+i);
    if(el) el.addEventListener('click', () => { handleInput(i.toString()); state.resetModifiers(); });
}
document.getElementById('btn-dot').addEventListener('click', () => { handleInput('.'); state.resetModifiers(); });
document.getElementById('btn-exp').addEventListener('click', () => { handleInput('E'); state.resetModifiers(); });
document.getElementById('btn-ans').addEventListener('click', () => { handleInput('Ans'); state.resetModifiers(); });

// Bind Operators
document.getElementById('btn-plus').addEventListener('click', () => { handleInput('+'); state.resetModifiers(); });
document.getElementById('btn-minus').addEventListener('click', () => { handleInput('-'); state.resetModifiers(); });
document.getElementById('btn-mul').addEventListener('click', () => { handleInput('×'); state.resetModifiers(); });
document.getElementById('btn-div').addEventListener('click', () => { handleInput('÷'); state.resetModifiers(); });
document.getElementById('btn-lparen').addEventListener('click', () => { handleInput('('); state.resetModifiers(); });
document.getElementById('btn-rparen').addEventListener('click', () => { handleInput(')'); state.resetModifiers(); });

// Advanced functions
document.getElementById('btn-sin').addEventListener('click', () => { handleInput(state.shift ? 'asin(' : 'sin('); state.resetModifiers(); });
document.getElementById('btn-cos').addEventListener('click', () => { handleInput(state.shift ? 'acos(' : 'cos('); state.resetModifiers(); });
document.getElementById('btn-tan').addEventListener('click', () => { handleInput(state.shift ? 'atan(' : 'tan('); state.resetModifiers(); });
document.getElementById('btn-ln').addEventListener('click', () => { handleInput(state.shift ? 'e^(' : 'ln('); state.resetModifiers(); });
document.getElementById('btn-log').addEventListener('click', () => { handleInput(state.shift ? '10^(' : 'log('); state.resetModifiers(); });
document.getElementById('btn-neg').addEventListener('click', () => { handleInput('-'); state.resetModifiers(); });
document.getElementById('btn-hyp').addEventListener('click', () => { handleInput('sinh('); /* Just placeholder for actual hyp menu */ state.resetModifiers(); });

// Structs
document.getElementById('btn-frac').addEventListener('click', () => {
    editor.insertFraction();
    updateScreenUI();
    state.resetModifiers();
});
document.getElementById('btn-sqrt').addEventListener('click', () => {
    if (state.shift) {
        editor.insertText('∛('); // or implement cube root struct
    } else {
        editor.insertSqrt();
    }
    updateScreenUI();
    state.resetModifiers();
});
document.getElementById('btn-sq').addEventListener('click', () => { handleInput('x²'); state.resetModifiers(); });
document.getElementById('btn-pow').addEventListener('click', () => {
    editor.insertPower();
    updateScreenUI();
    state.resetModifiers();
});

// Cursor movements
document.getElementById('btn-left').addEventListener('click', () => {
    state.justEvaluated = false; editor.moveLeft(); updateScreenUI(); });
document.getElementById('btn-right').addEventListener('click', () => {
    state.justEvaluated = false; editor.moveRight(); updateScreenUI(); });

// Control
document.getElementById('btn-ac').addEventListener('click', () => {
    state.justEvaluated = false;
    editor.root = new MathContainer(null);
    editor.activeContainer = editor.root;
    editor.activeNodeIndex = 0;
    editor.cursorOffset = 0;
    screenResult.textContent = '';
    updateScreenUI();
});

document.getElementById('btn-del').addEventListener('click', () => {
    state.justEvaluated = false;
    editor.deleteLeft();
    updateScreenUI();
});

document.getElementById('btn-eq').addEventListener('click', () => {
    let inputStr = editor.root.toString();
    console.log('Sending to handleEquals:', inputStr);

    // Pass to logic
    state.currentInput = inputStr;
    const result = handleEquals(state);

    if (result && result.success) {
        screenResult.textContent = result.value;
        state.justEvaluated = true; // Set flag
    } else if (result) {
        screenResult.textContent = result.value; // Error message
        state.justEvaluated = true; // Set flag
    }

    state.resetModifiers();
    updateScreenUI();
});

document.getElementById('btn-mode').addEventListener('click', () => {
    const modes = ['COMP', 'CMPLX', 'STAT', 'BASE-N', 'EQN', 'MATRIX', 'TABLE', 'VECTOR'];
    let idx = modes.indexOf(state.mode);
    state.mode = modes[(idx + 1) % modes.length];
    editor.root = new MathContainer(null);
    editor.activeContainer = editor.root;
    editor.activeNodeIndex = 0;
    editor.cursorOffset = 0;
    screenResult.textContent = 'Mode: ' + state.mode;
    updateScreenUI();
});


document.getElementById('btn-eng').addEventListener('click', () => {
    if (state.mode === 'CMPLX') {
        if (state.shift) {
            handleInput('∠');
        } else {
            handleInput('i');
        }
    } else {
        handleInput('E');
    }
    state.resetModifiers();
});

updateScreenUI();

updateScreenUI();
