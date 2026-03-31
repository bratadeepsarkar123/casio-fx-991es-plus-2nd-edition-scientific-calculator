const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const html = fs.readFileSync('index.html', 'utf8');
const dom = new JSDOM(html, { runScripts: "dangerously" });
const document = dom.window.document;

function click(id) {
    const el = document.getElementById(id);
    if (!el) throw new Error(`Button ${id} not found`);
    el.click();
}

function expectScreen(input, result) {
    const screenInput = document.getElementById('screen-input').innerHTML;
    const screenResult = document.getElementById('screen-result').textContent;
    if (input !== null && screenInput !== input) throw new Error(`Expected input '${input}', got '${screenInput}'`);
    if (result !== null && screenResult !== result) throw new Error(`Expected result '${result}', got '${screenResult}'`);
}

// Ensure clean state
click('btn-mode'); // Should be CMPLX
click('btn-ac');

try {
    // Edge Case 2 UI Test: CMPLX mode, Polar input "5∠30"
    click('btn-5');
    click('btn-shift');
    click('btn-eng'); // ∠ when shift in CMPLX mode
    click('btn-3');
    click('btn-0');
    click('btn-eq');
    // Result should be evaluated as complex
    const result = document.getElementById('screen-result').textContent;
    console.log("5∠30 =", result);
    if (!result.includes('4.33')) throw new Error("Failed CMPLX parsing in UI");
    console.log("UI Test Edge Case 2 Passed");

    // Edge Case 4 UI Test: Ans loop
    click('btn-ac');
    click('btn-1');
    click('btn-eq');
    // Screen result is 1
    click('btn-plus'); // implicitly adds Ans to input "Ans+"
    click('btn-1');
    click('btn-eq');
    expectScreen(null, '2'); // Result is 2

    // Now just press eq again
    click('btn-eq');
    expectScreen(null, '3');
    console.log("UI Test Edge Case 4 Passed");

    console.log("All UI Tests Passed.");

} catch (e) {
    console.error(e);
}
