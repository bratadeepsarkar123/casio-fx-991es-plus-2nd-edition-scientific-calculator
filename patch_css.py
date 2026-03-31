with open("css/styles.css", "r") as f:
    css = f.read()

import re

# Refine scientific block layout
css = re.sub(r'\.sci-block \{.*?\}',
    '.sci-block {\n    display: grid;\n    grid-template-columns: repeat(6, 1fr);\n    gap: 15px 5px;\n    margin-bottom: 20px;\n}', css, flags=re.DOTALL)

css = re.sub(r'\.num-block \{.*?\}',
    '.num-block {\n    display: grid;\n    grid-template-columns: repeat(5, 1fr);\n    gap: 12px 10px;\n}', css, flags=re.DOTALL)

css += """
.btn-del-ac { background: #d97706; color: white; height: 35px; border-radius: 6px; box-shadow: 0 4px 0 #b45309; }
.btn-eq { background: #3b82f6; color: white; height: 35px; border-radius: 6px; box-shadow: 0 4px 0 #2563eb; }
.btn-op { background: #cbd5e1; color: #0f172a; height: 35px; box-shadow: 0 4px 0 #94a3b8; }
.btn-num { background: #f8fafc; color: #0f172a; height: 35px; font-size: 16px; box-shadow: 0 4px 0 #cbd5e1; }
.btn-sci { background: #1e293b; color: #f8fafc; font-size: 11px; box-shadow: 0 4px 0 #0f172a; width: 38px; }

/* D-Pad refinement */
.d-pad-container {
    margin-top: 10px;
}
.d-btn:active {
    background: rgba(0,0,0,0.1);
}

.top-controls .btn-container { margin-top: 15px !important; }

"""
with open("css/styles.css", "w") as f:
    f.write(css)
