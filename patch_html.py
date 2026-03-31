with open("index.html", "r") as f:
    html = f.read()

import re

# Strip old body
body_start = html.find('<body>')
body_end = html.find('</body>') + len('</body>')

new_body = """<body>
<div class="calculator">
    <div class="brand">CASIO</div>
    <div class="model-num">fx-991ES PLUS</div>
    <div class="nat-vpam">NATURAL-V.P.A.M. 2nd edition</div>

    <div class="screen-container">
        <div id="screen-input"></div>
        <div id="screen-result"></div>
    </div>

    <div class="keyboard">
        <!-- Top Row Controls -->
        <div class="top-controls">
            <div class="btn-container" style="margin-top: 5px;">
                <span class="lbl-yellow">SHIFT</span>
                <button class="btn btn-round btn-shift" id="btn-shift"></button>
            </div>
            <div class="btn-container" style="margin-top: 5px;">
                <span class="lbl-red">ALPHA</span>
                <button class="btn btn-round btn-alpha" id="btn-alpha"></button>
            </div>

            <div class="d-pad-container">
                <button class="d-btn d-up" id="btn-up"></button>
                <button class="d-btn d-down" id="btn-down"></button>
                <button class="d-btn d-left" id="btn-left"></button>
                <button class="d-btn d-right" id="btn-right"></button>
                <div class="d-center-bump"></div>
            </div>

            <div class="btn-container" style="margin-top: 5px;">
                <span class="lbl-yellow">SETUP</span>
                <button class="btn btn-round btn-mode" id="btn-mode">MODE</button>
            </div>
            <div class="btn-container" style="margin-top: 5px;">
                <button class="btn btn-round btn-on" id="btn-on">ON</button>
            </div>
        </div>

        <!-- Scientific Functions -->
        <div class="sci-block">
            <!-- Row 1 -->
            <div class="btn-container"><span class="lbl-yellow">SOLVE</span><span class="lbl-red">=</span><button class="btn btn-sci" id="btn-calc">CALC</button></div>
            <div class="btn-container"><span class="lbl-yellow">d/dx</span><span class="lbl-red">:</span><button class="btn btn-sci" id="btn-int">∫</button></div>
            <div class="btn-container"><span class="lbl-yellow">x!</span><button class="btn btn-sci" id="btn-xinv">x⁻¹</button></div>
            <div class="btn-container"><span class="lbl-yellow">Σ</span><button class="btn btn-sci" id="btn-logab">log_■</button></div>
            <div class="btn-container"><button class="btn btn-sci" id="btn-frac">■/■</button></div>
            <div class="btn-container"><span class="lbl-yellow">∛</span><button class="btn btn-sci" id="btn-sqrt">√■</button></div>

            <!-- Row 2 -->
            <div class="btn-container"><span class="lbl-yellow">x²</span><button class="btn btn-sci" id="btn-sq">x²</button></div>
            <div class="btn-container"><span class="lbl-yellow">x√</span><button class="btn btn-sci" id="btn-pow">x^■</button></div>
            <div class="btn-container"><span class="lbl-yellow">10^x</span><button class="btn btn-sci" id="btn-log">log</button></div>
            <div class="btn-container"><span class="lbl-yellow">e^x</span><button class="btn btn-sci" id="btn-ln">ln</button></div>
            <div class="btn-container"><span class="lbl-red">A</span><button class="btn btn-sci" id="btn-neg">(-)</button></div>
            <div class="btn-container"><span class="lbl-yellow">FACT</span><span class="lbl-red">B</span><button class="btn btn-sci" id="btn-deg">°'"</button></div>

            <!-- Row 3 -->
            <div class="btn-container"><span class="lbl-yellow">Abs</span><span class="lbl-red">C</span><button class="btn btn-sci" id="btn-hyp">hyp</button></div>
            <div class="btn-container"><span class="lbl-yellow">sin⁻¹</span><span class="lbl-red">D</span><button class="btn btn-sci" id="btn-sin">sin</button></div>
            <div class="btn-container"><span class="lbl-yellow">cos⁻¹</span><span class="lbl-red">E</span><button class="btn btn-sci" id="btn-cos">cos</button></div>
            <div class="btn-container"><span class="lbl-yellow">tan⁻¹</span><span class="lbl-red">F</span><button class="btn btn-sci" id="btn-tan">tan</button></div>
            <div class="btn-container"><span class="lbl-yellow">STO</span><span class="lbl-red">X</span><button class="btn btn-sci" id="btn-rcl">RCL</button></div>
            <div class="btn-container"><span class="lbl-yellow">←</span><span class="lbl-red">Y</span><button class="btn btn-sci" id="btn-eng">ENG</button></div>

            <!-- Row 4 -->
            <div class="btn-container"><button class="btn btn-sci" id="btn-lparen">(</button></div>
            <div class="btn-container"><button class="btn btn-sci" id="btn-rparen">)</button></div>
            <div class="btn-container"><span class="lbl-yellow">%</span><span class="lbl-red">M</span><button class="btn btn-sci" id="btn-sd">S⇔D</button></div>
            <div class="btn-container"><button class="btn btn-sci" id="btn-mplus">M+</button></div>
            <div class="btn-container" style="grid-column: span 2;"></div>
        </div>

        <!-- Numpad -->
        <div class="num-block">
            <!-- Row 1 -->
            <button class="btn btn-num" id="btn-7">7</button>
            <button class="btn btn-num" id="btn-8">8</button>
            <button class="btn btn-num" id="btn-9">9</button>
            <button class="btn btn-del-ac" id="btn-del">DEL</button>
            <button class="btn btn-del-ac" id="btn-ac">AC</button>

            <!-- Row 2 -->
            <button class="btn btn-num" id="btn-4">4</button>
            <button class="btn btn-num" id="btn-5">5</button>
            <button class="btn btn-num" id="btn-6">6</button>
            <button class="btn btn-op" id="btn-mul">×</button>
            <button class="btn btn-op" id="btn-div">÷</button>

            <!-- Row 3 -->
            <button class="btn btn-num" id="btn-1">1</button>
            <button class="btn btn-num" id="btn-2">2</button>
            <button class="btn btn-num" id="btn-3">3</button>
            <button class="btn btn-op" id="btn-plus">+</button>
            <button class="btn btn-op" id="btn-minus">-</button>

            <!-- Row 4 -->
            <button class="btn btn-num" id="btn-0">0</button>
            <button class="btn btn-num" id="btn-dot">.</button>
            <div class="btn-container"><span class="lbl-yellow">π</span><span class="lbl-red">e</span><button class="btn btn-op" id="btn-exp">x10ˣ</button></div>
            <button class="btn btn-op" id="btn-ans">Ans</button>
            <button class="btn btn-eq" id="btn-eq">=</button>
        </div>
    </div>
</div>
</body>"""

new_html = html[:body_start] + new_body + html[body_end:]

with open("index.html", "w") as f:
    f.write(new_html)
