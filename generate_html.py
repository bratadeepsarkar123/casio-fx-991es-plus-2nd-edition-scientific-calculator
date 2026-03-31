html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Casio fx-991ES PLUS 2nd Edition Replica</title>
    <style>
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background-color: #e0e0e0;
            font-family: 'Arial', sans-serif;
        }

        #calculator {
            background-color: #2b2b2b; /* Dark casing */
            border-radius: 20px;
            padding: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5), inset 0 2px 5px rgba(255,255,255,0.1);
            width: 320px;
            display: flex;
            flex-direction: column;
            gap: 15px;
            position: relative;
        }

        /* Top Brand Area */
        .brand-area {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            color: white;
            padding: 0 10px;
        }
        .brand-logo {
            font-weight: bold;
            font-size: 1.2rem;
            letter-spacing: 1px;
        }
        .brand-model {
            font-size: 0.7rem;
            font-style: italic;
            color: #aaa;
        }
        .solar-panel {
            width: 80px;
            height: 25px;
            background-color: #3d2c2c;
            border: 1px solid #1a1a1a;
            border-radius: 3px;
        }

        /* LCD Screen */
        .screen-container {
            background-color: #9ab4a3; /* Casio screen green/grey */
            border: 2px solid #555;
            border-radius: 5px;
            padding: 5px;
            height: 70px;
            display: flex;
            flex-direction: column;
            box-shadow: inset 0 2px 5px rgba(0,0,0,0.3);
            font-family: 'Courier New', Courier, monospace; /* Monospace for dots */
            color: #1a1a1a;
            position: relative;
        }

        .screen-indicators {
            display: flex;
            font-size: 8px;
            height: 10px;
            gap: 5px;
        }
        .indicator {
            display: none; /* Hidden by default */
        }
        .indicator.active {
            display: block;
        }

        .screen-main {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding-top: 5px;
        }

        .screen-input {
            font-size: 16px;
            text-align: left;
            min-height: 20px;
            overflow: hidden;
            white-space: nowrap;
        }

        .screen-result {
            font-size: 20px;
            text-align: right;
            font-weight: bold;
            min-height: 24px;
        }

        /* Button Grid Framework */
        .keypad {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        /* Modifiers & Top Row */
        .top-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
        }

        .btn-group {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2px;
            width: 35px;
        }

        .btn {
            background-color: #4a4a4a;
            color: white;
            border: none;
            border-radius: 5px;
            border-bottom: 2px solid #222;
            cursor: pointer;
            font-size: 0.8rem;
            font-weight: bold;
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            transition: transform 0.1s, border-bottom 0.1s;
            user-select: none;
        }

        .btn:active {
            transform: translateY(2px);
            border-bottom: 0px solid #222;
        }

        .btn-small {
            width: 35px;
            height: 22px;
            border-radius: 10px;
        }

        .btn-round {
            width: 25px;
            height: 25px;
            border-radius: 50%;
        }

        /* D-Pad */
        .d-pad-container {
            width: 70px;
            height: 70px;
            position: relative;
        }
        .d-pad {
            position: absolute;
            background: linear-gradient(135deg, #d3d3d3, #999);
            border-radius: 50%;
            width: 100%;
            height: 100%;
            box-shadow: 0 3px 6px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.5);
        }
        .d-btn {
            position: absolute;
            background: transparent;
            border: none;
            width: 25px;
            height: 25px;
            cursor: pointer;
            z-index: 10;
        }
        .d-up { top: 0; left: 22.5px; }
        .d-down { bottom: 0; left: 22.5px; }
        .d-left { left: 0; top: 22.5px; }
        .d-right { right: 0; top: 22.5px; }

        .d-center {
            position: absolute;
            top: 15px;
            left: 15px;
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #bbb, #777);
            border-radius: 50%;
            pointer-events: none;
        }

        /* Scientific Grid */
        .sci-grid {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 8px 6px;
        }

        .sci-btn {
            height: 25px;
            background-color: #333;
            border-radius: 4px;
            font-size: 0.75rem;
        }

        /* Numpad Grid */
        .numpad-grid {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 10px 8px;
            margin-top: 5px;
        }

        .num-btn {
            height: 35px;
            background-color: #e0e0e0;
            color: #000;
            font-size: 1.1rem;
            border-radius: 5px;
        }

        .op-btn {
            height: 35px;
            background-color: #888;
            color: white;
            font-size: 1.1rem;
        }

        .del-btn {
            background-color: #a3c18b; /* Greenish */
            color: #000;
        }

        .ac-btn {
            background-color: #a3c18b;
            color: #000;
        }

        /* Labels above buttons */
        .label {
            font-size: 0.55rem;
            font-weight: bold;
            white-space: nowrap;
        }
        .label-yellow { color: #d4a017; } /* Shift */
        .label-red { color: #c44040; } /* Alpha */
        .label-grey { color: #aaa; }

        /* Container for a button and its top labels */
        .key-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
        }

        .labels-top {
            display: flex;
            justify-content: space-between;
            width: 100%;
            margin-bottom: 2px;
            padding: 0 2px;
            box-sizing: border-box;
            position: absolute;
            top: -12px;
        }

        /* Natural display HTML renderers */
        .frac {
            display: inline-flex;
            flex-direction: column;
            align-items: center;
            vertical-align: middle;
            margin: 0 2px;
        }
        .frac > span:first-child {
            border-bottom: 1px solid #000;
            padding: 0 2px;
        }
        .frac > span:last-child {
            padding: 0 2px;
        }

        .sqrt {
            display: inline-flex;
            align-items: center;
        }
        .sqrt::before {
            content: '√';
            font-size: 1.2em;
        }
        .sqrt-inner {
            border-top: 1px solid #000;
            padding-top: 1px;
            margin-left: -2px;
        }

    </style>
</head>
<body>

<div id="calculator">
    <!-- Brand & Solar -->
    <div class="brand-area">
        <div>
            <div class="brand-logo">CASIO</div>
            <div class="brand-model">fx-991ES PLUS<br>NATURAL-V.P.A.M.</div>
        </div>
        <div class="solar-panel"></div>
    </div>

    <!-- Screen -->
    <div class="screen-container">
        <div class="screen-indicators">
            <span id="ind-s" class="indicator">S</span>
            <span id="ind-a" class="indicator">A</span>
            <span id="ind-m" class="indicator">M</span>
            <span id="ind-sto" class="indicator">STO</span>
            <span id="ind-rcl" class="indicator">RCL</span>
            <span id="ind-stat" class="indicator">STAT</span>
            <span id="ind-cmplx" class="indicator">CMPLX</span>
            <span id="ind-mat" class="indicator">MAT</span>
            <span id="ind-vct" class="indicator">VCT</span>
            <span id="ind-d" class="indicator active">D</span> <!-- Degrees by default -->
            <span id="ind-r" class="indicator">R</span>
            <span id="ind-g" class="indicator">G</span>
            <span id="ind-fix" class="indicator">FIX</span>
            <span id="ind-sci" class="indicator">SCI</span>
            <span id="ind-math" class="indicator active" style="margin-left:auto;">Math ▲</span>
        </div>
        <div class="screen-main">
            <div id="screen-input" class="screen-input"></div>
            <div id="screen-result" class="screen-result"></div>
        </div>
    </div>

    <!-- Keypad -->
    <div class="keypad">

        <!-- Top Row -->
        <div class="top-row">
            <div class="key-container" style="width: 35px; margin-top: 12px;">
                <div class="labels-top"><span class="label label-yellow"></span></div>
                <button class="btn btn-small btn-round" id="btn-shift" style="width:25px;">SHIFT</button>
            </div>
            <div class="key-container" style="width: 35px; margin-top: 12px;">
                <div class="labels-top"><span class="label label-red"></span></div>
                <button class="btn btn-small btn-round" id="btn-alpha" style="width:25px;">ALPHA</button>
            </div>

            <div class="d-pad-container">
                <div class="d-pad"></div>
                <div class="d-center"></div>
                <button class="d-btn d-up" id="btn-up"></button>
                <button class="d-btn d-down" id="btn-down"></button>
                <button class="d-btn d-left" id="btn-left"></button>
                <button class="d-btn d-right" id="btn-right"></button>
            </div>

            <div class="key-container" style="width: 35px; margin-top: 12px;">
                <div class="labels-top"><span class="label label-yellow">SETUP</span></div>
                <button class="btn btn-small btn-round" id="btn-mode" style="width:25px;">MODE</button>
            </div>
            <div class="key-container" style="width: 35px; margin-top: 12px;">
                <div class="labels-top"></div>
                <button class="btn btn-small btn-round" id="btn-on" style="width:25px;">ON</button>
            </div>
        </div>

        <!-- Scientific Grid -->
        <div class="sci-grid" style="margin-top: 15px;">
            <!-- Row 1 -->
            <div class="key-container">
                <div class="labels-top"><span class="label label-yellow">SOLVE</span><span class="label label-red">=</span></div>
                <button class="btn sci-btn" id="btn-calc">CALC</button>
            </div>
            <div class="key-container">
                <div class="labels-top"><span class="label label-yellow">d/dx</span><span class="label label-red">:</span></div>
                <button class="btn sci-btn" id="btn-int">∫</button>
            </div>
            <div class="key-container">
                <div class="labels-top"><span class="label label-yellow">x!</span></div>
                <button class="btn sci-btn" id="btn-xinv">x⁻¹</button>
            </div>
            <div class="key-container">
                <div class="labels-top"><span class="label label-yellow">Σ</span></div>
                <button class="btn sci-btn" id="btn-logab">log_■</button>
            </div>
            <div class="key-container">
                <div class="labels-top"><span class="label label-yellow">■/■</span></div>
                <button class="btn sci-btn" id="btn-frac">■/■</button>
            </div>
            <div class="key-container">
                <div class="labels-top"><span class="label label-yellow">³√■</span></div>
                <button class="btn sci-btn" id="btn-sqrt">√■</button>
            </div>

            <!-- Row 2 -->
            <div class="key-container">
                <div class="labels-top"><span class="label label-yellow">DEC</span></div>
                <button class="btn sci-btn" id="btn-sq">x²</button>
            </div>
            <div class="key-container">
                <div class="labels-top"><span class="label label-yellow">HEX</span></div>
                <button class="btn sci-btn" id="btn-pow">x^■</button>
            </div>
            <div class="key-container">
                <div class="labels-top"><span class="label label-yellow">10^■</span><span class="label label-grey">BIN</span></div>
                <button class="btn sci-btn" id="btn-log">log</button>
            </div>
            <div class="key-container">
                <div class="labels-top"><span class="label label-yellow">e^■</span><span class="label label-grey">OCT</span></div>
                <button class="btn sci-btn" id="btn-ln">ln</button>
            </div>
            <div class="key-container">
                <div class="labels-top"><span class="label label-yellow">A</span><span class="label label-red">A</span></div>
                <button class="btn sci-btn" id="btn-neg">(-)</button>
            </div>
            <div class="key-container">
                <div class="labels-top"><span class="label label-yellow">B</span><span class="label label-red">B</span></div>
                <button class="btn sci-btn" id="btn-deg">°'\"</button>
            </div>

            <!-- Row 3 -->
            <div class="key-container">
                <div class="labels-top"><span class="label label-yellow">C</span><span class="label label-red">C</span></div>
                <button class="btn sci-btn" id="btn-hyp">hyp</button>
            </div>
            <div class="key-container">
                <div class="labels-top"><span class="label label-yellow">sin⁻¹</span><span class="label label-red">D</span></div>
                <button class="btn sci-btn" id="btn-sin">sin</button>
            </div>
            <div class="key-container">
                <div class="labels-top"><span class="label label-yellow">cos⁻¹</span><span class="label label-red">E</span></div>
                <button class="btn sci-btn" id="btn-cos">cos</button>
            </div>
            <div class="key-container">
                <div class="labels-top"><span class="label label-yellow">tan⁻¹</span><span class="label label-red">F</span></div>
                <button class="btn sci-btn" id="btn-tan">tan</button>
            </div>
            <div class="key-container">
                <div class="labels-top"><span class="label label-yellow">STO</span></div>
                <button class="btn sci-btn" id="btn-rcl">RCL</button>
            </div>
            <div class="key-container">
                <div class="labels-top"><span class="label label-yellow">←</span><span class="label label-red">i</span></div>
                <button class="btn sci-btn" id="btn-eng">ENG</button>
            </div>

            <!-- Row 4 -->
            <div class="key-container">
                <div class="labels-top"><span class="label label-yellow">%</span></div>
                <button class="btn sci-btn" id="btn-lparen">(</button>
            </div>
            <div class="key-container">
                <div class="labels-top"><span class="label label-yellow">,</span><span class="label label-red">X</span></div>
                <button class="btn sci-btn" id="btn-rparen">)</button>
            </div>
            <div class="key-container">
                <div class="labels-top"><span class="label label-yellow">a b/c</span><span class="label label-red">Y</span></div>
                <button class="btn sci-btn" id="btn-sd">S⇔D</button>
            </div>
            <div class="key-container">
                <div class="labels-top"><span class="label label-yellow">M-</span><span class="label label-red">M</span></div>
                <button class="btn sci-btn" id="btn-mplus">M+</button>
            </div>
            <!-- Blank fillers for grid alignment if needed, but we have 24 sci buttons mapped roughly to the 4 rows of 6 -->
            <div style="grid-column: 5 / 7;"></div>
        </div>

        <!-- Numpad Grid -->
        <div class="numpad-grid">
            <div class="key-container">
                <div class="labels-top"><span class="label label-yellow">CONST</span></div>
                <button class="btn num-btn" id="btn-7">7</button>
            </div>
            <div class="key-container">
                <div class="labels-top"><span class="label label-yellow">CONV</span></div>
                <button class="btn num-btn" id="btn-8">8</button>
            </div>
            <div class="key-container">
                <div class="labels-top"><span class="label label-yellow">CLR</span></div>
                <button class="btn num-btn" id="btn-9">9</button>
            </div>
            <div class="key-container">
                <div class="labels-top"><span class="label label-yellow">INS</span></div>
                <button class="btn op-btn del-btn" id="btn-del">DEL</button>
            </div>
            <div class="key-container">
                <div class="labels-top"><span class="label label-yellow">OFF</span></div>
                <button class="btn op-btn ac-btn" id="btn-ac">AC</button>
            </div>

            <div class="key-container">
                <div class="labels-top"><span class="label label-yellow">MATRIX</span></div>
                <button class="btn num-btn" id="btn-4">4</button>
            </div>
            <div class="key-container">
                <div class="labels-top"><span class="label label-yellow">VECTOR</span></div>
                <button class="btn num-btn" id="btn-5">5</button>
            </div>
            <div class="key-container">
                <div class="labels-top"></div>
                <button class="btn num-btn" id="btn-6">6</button>
            </div>
            <div class="key-container">
                <div class="labels-top"><span class="label label-yellow">nPr</span></div>
                <button class="btn op-btn" id="btn-mul">×</button>
            </div>
            <div class="key-container">
                <div class="labels-top"><span class="label label-yellow">nCr</span></div>
                <button class="btn op-btn" id="btn-div">÷</button>
            </div>

            <div class="key-container">
                <div class="labels-top"><span class="label label-yellow">STAT</span></div>
                <button class="btn num-btn" id="btn-1">1</button>
            </div>
            <div class="key-container">
                <div class="labels-top"><span class="label label-yellow">CMPLX</span></div>
                <button class="btn num-btn" id="btn-2">2</button>
            </div>
            <div class="key-container">
                <div class="labels-top"><span class="label label-yellow">BASE</span></div>
                <button class="btn num-btn" id="btn-3">3</button>
            </div>
            <div class="key-container">
                <div class="labels-top"><span class="label label-yellow">Pol</span></div>
                <button class="btn op-btn" id="btn-plus">+</button>
            </div>
            <div class="key-container">
                <div class="labels-top"><span class="label label-yellow">Rec</span></div>
                <button class="btn op-btn" id="btn-minus">-</button>
            </div>

            <div class="key-container">
                <div class="labels-top"><span class="label label-yellow">Rnd</span></div>
                <button class="btn num-btn" id="btn-0">0</button>
            </div>
            <div class="key-container">
                <div class="labels-top"><span class="label label-yellow">Ran#</span><span class="label label-red">RanInt</span></div>
                <button class="btn num-btn" id="btn-dot">.</button>
            </div>
            <div class="key-container">
                <div class="labels-top"><span class="label label-yellow">π</span><span class="label label-red">e</span></div>
                <button class="btn num-btn" id="btn-exp">×10ˣ</button>
            </div>
            <div class="key-container">
                <div class="labels-top"><span class="label label-yellow">DRG▶</span></div>
                <button class="btn num-btn" id="btn-ans" style="font-size:1rem;">Ans</button>
            </div>
            <div class="key-container">
                <div class="labels-top"><span class="label label-yellow">≈</span></div>
                <button class="btn op-btn" id="btn-eq">=</button>
            </div>
        </div>

    </div>
</div>

<script>
    // JS Logic goes here
    console.log("UI Initialized");
</script>
</body>
</html>
"""

with open("index.html", "w") as f:
    f.write(html)

print("index.html created successfully.")
