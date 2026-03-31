const fs = require('fs');
let keyboard = fs.readFileSync('js/ui/keyboard.js', 'utf8');

// The original keyboard.js has `document.getElementById('btn-plus').addEventListener` etc.
// But we changed some IDs or layout in HTML slightly. Let's make sure things like 'x10x'
// and the Ans button are wired correctly.
// Also add shift highlighting.

keyboard = keyboard.replace(
    "if (state.shift) {\n        // highlight shift indicator\n    }",
    "const shiftLbls = document.querySelectorAll('.lbl-yellow');\n    const alphaLbls = document.querySelectorAll('.lbl-red');\n    if (state.shift) {\n        shiftLbls.forEach(el => el.style.textShadow = '0 0 5px yellow');\n        alphaLbls.forEach(el => el.style.textShadow = 'none');\n    } else if (state.alpha) {\n        alphaLbls.forEach(el => el.style.textShadow = '0 0 5px red');\n        shiftLbls.forEach(el => el.style.textShadow = 'none');\n    } else {\n        shiftLbls.forEach(el => el.style.textShadow = 'none');\n        alphaLbls.forEach(el => el.style.textShadow = 'none');\n    }"
);

fs.writeFileSync('js/ui/keyboard.js', keyboard);
