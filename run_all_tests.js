const { execSync } = require('child_process');

console.log('--- Running Edge Case 1 (Implicit Multiplication) & Edge Case 5 (Syntax Failures) ---');
execSync('node test_parser.js', { stdio: 'inherit' });

console.log('\n--- Running Edge Case 2 (CMPLX Mode & Polar) & Edge Case 5 (Math Failures) ---');
execSync('node test_complex.js', { stdio: 'inherit' });

console.log('\n--- Running Edge Case 3 (EQN Mode Complex Roots) ---');
execSync('node test_eqn.js', { stdio: 'inherit' });

console.log('\n--- Running Edge Case 4 (Ans Loop Logic) ---');
execSync('node -e "const { handleEquals, state } = require(\'./main_logic.js\'); state.currentInput = \'1\'; handleEquals(state); state.currentInput = \'+ 1\'; handleEquals(state); let res = handleEquals(state); if (res.value === \'3\') { console.log(\'Edge Case 4 Passed: Ans looping works.\'); } else { throw new Error(\'Failed Edge Case 4\'); }"', { stdio: 'inherit' });

console.log('\nAll tests executed successfully.');
