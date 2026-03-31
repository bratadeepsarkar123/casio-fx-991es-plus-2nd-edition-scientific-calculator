import re

with open("index.html", "r") as f:
    html = f.read()

# Read the generated styles
with open("css/styles.css", "r") as f:
    css = f.read()

# Load js files in order
files = [
    'js/math/engine.js',
    'js/math/solvers.js',
    'js/modes/base_n.js',
    'js/modes/eqn.js',
    'js/modes/matrix.js',
    'js/modes/stat.js',
    'js/modes/table.js',
    'js/modes/vector.js',
    'js/state.js',
    'js/math/parser.js',
    'js/ui/math_editor.js',
    'js/app.js',
    'js/ui/keyboard.js'
]

js_code = []
for file in files:
    try:
        with open(file, "r") as f:
            content = f.read()
            # Remove node.js specific exports/requires
            content = re.sub(r'const \{.*?\} = require\(.*?\);', '', content)
            content = re.sub(r'module\.exports = \{.*?\};', '', content)
            js_code.append(f"// --- {file} ---\n" + content)
    except FileNotFoundError:
        pass

full_js = "\n".join(js_code)

# Strip out existing <style> block and replace
html = re.sub(r'<style>.*?</style>', f'<style>\n{css}\n</style>', html, flags=re.DOTALL)

# Re-implement without using format strings to avoid re.sub complaining about escape characters
start_tag = "<script>"
end_tag = "</script>"
start_idx = html.find(start_tag)
end_idx = html.find(end_tag) + len(end_tag)

html = html[:start_idx] + f"<script>\n{full_js}\n</script>" + html[end_idx:]

with open("index.html", "w") as f:
    f.write(html)

print("Bundled into index.html")
