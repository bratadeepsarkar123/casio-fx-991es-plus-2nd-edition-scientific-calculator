import re

with open("index.html", "r") as f:
    html = f.read()

# Fix the duplicate listener bug on btn-eng
html = html.replace("document.getElementById('btn-eng').addEventListener('click', () => handleInput(state.shift ? '←' : 'ENG'));", "")

with open("index.html", "w") as f:
    f.write(html)
