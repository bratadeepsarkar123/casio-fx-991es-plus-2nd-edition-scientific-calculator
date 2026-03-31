with open("index.html", "r") as f:
    html = f.read()

# There's a duplicate of the body content somewhere. Let's find out why.
import re
bodies = re.findall(r'<div class="calculator">', html)
print(f"Found {len(bodies)} calculator divs")

# Cleanly rebuild the HTML
# Keep only the first occurrence
if len(bodies) > 1:
    idx1 = html.find('<div class="calculator">')
    idx2 = html.find('<div class="calculator">', idx1 + 1)
    if idx2 > -1:
        # Strip from idx2 up to just before </body>
        body_end = html.find('</body>', idx2)
        html = html[:idx2] + html[body_end:]

with open("index.html", "w") as f:
    f.write(html)
