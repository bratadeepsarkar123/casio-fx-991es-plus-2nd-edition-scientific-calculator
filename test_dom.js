const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const html = fs.readFileSync('index.html', 'utf8');
const dom = new JSDOM(html);
const document = dom.window.document;

const btnCount = document.querySelectorAll('button').length;
console.log(`Found ${btnCount} buttons in the DOM.`);
if (btnCount >= 45) { // roughly 50 buttons on the calculator
    console.log("DOM Validation passed.");
} else {
    console.error("Not enough buttons found. Check HTML.");
}
