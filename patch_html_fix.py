import re

with open("index.html", "r") as f:
    html = f.read()

# Fix the broken HTML artifact from the previous python scripts
html = re.sub(r'</script>E html><html lang="en">.*', '</script>\n</body>\n</html>', html, flags=re.DOTALL)

with open("index.html", "w") as f:
    f.write(html)
