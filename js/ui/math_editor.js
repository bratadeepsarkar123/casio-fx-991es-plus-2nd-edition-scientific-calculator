// --- Natural V.P.A.M Math Editor Core ---
// Represents a mathematical expression as a tree of blocks that can be rendered to HTML and parsed to string

class MathNode {
    constructor(parent = null) {
        this.parent = parent;
        this.children = [];
    }
    toHTML(isCursorHere) { return ""; }
    toString() { return ""; }
    getLeftSibling() {
        if (!this.parent) return null;
        const idx = this.parent.children.indexOf(this);
        return idx > 0 ? this.parent.children[idx - 1] : null;
    }
    getRightSibling() {
        if (!this.parent) return null;
        const idx = this.parent.children.indexOf(this);
        return idx < this.parent.children.length - 1 ? this.parent.children[idx + 1] : null;
    }
}

class TextNode extends MathNode {
    constructor(text, parent = null) {
        super(parent);
        this.text = text;
    }
    toHTML(cursorPos) {
        // cursorPos is the index where the cursor sits.
        // 0 means before the first char, length means after the last.
        if (cursorPos === null) {
            return `<span class="math-text">${this.text.replace(/ /g, '&nbsp;')}</span>`;
        } else {
            const before = this.text.substring(0, cursorPos).replace(/ /g, '&nbsp;');
            const after = this.text.substring(cursorPos).replace(/ /g, '&nbsp;');
            return `<span class="math-text">${before}<span class="cursor"></span>${after}</span>`;
        }
    }
    toString() { return this.text; }
}

class FractionNode extends MathNode {
    constructor(parent = null) {
        super(parent);
        this.num = new MathContainer(this);
        this.den = new MathContainer(this);
        this.children = [this.num, this.den];
    }
    toHTML(cursorPos) { // cursorPos is an object { childIndex: 0|1, deepPos: ... } or null
        const numHTML = this.num.toHTML(cursorPos && cursorPos.childIndex === 0 ? cursorPos.deepPos : null);
        const denHTML = this.den.toHTML(cursorPos && cursorPos.childIndex === 1 ? cursorPos.deepPos : null);

        let c = cursorPos && cursorPos.childIndex === -1 ? '<span class="cursor"></span>' : ''; // cursor before frac
        let cAfter = cursorPos && cursorPos.childIndex === 2 ? '<span class="cursor"></span>' : ''; // cursor after frac

        return `${c}<span class="frac">
            <span class="frac-num">${numHTML}</span>
            <span class="frac-line"></span>
            <span class="frac-den">${denHTML}</span>
        </span>${cAfter}`;
    }
    toString() { return `(${this.num.toString()})/(${this.den.toString()})`; }
}

class SqrtNode extends MathNode {
    constructor(parent = null) {
        super(parent);
        this.arg = new MathContainer(this);
        this.children = [this.arg];
    }
    toHTML(cursorPos) {
        const argHTML = this.arg.toHTML(cursorPos && cursorPos.childIndex === 0 ? cursorPos.deepPos : null);
        let c = cursorPos && cursorPos.childIndex === -1 ? '<span class="cursor"></span>' : '';
        let cAfter = cursorPos && cursorPos.childIndex === 1 ? '<span class="cursor"></span>' : '';
        return `${c}<span class="sqrt">
            <span class="sqrt-sign">√</span>
            <span class="sqrt-body">${argHTML}</span>
        </span>${cAfter}`;
    }
    toString() { return `sqrt(${this.arg.toString()})`; }
}

class PowerNode extends MathNode {
    constructor(parent = null) {
        super(parent);
        this.exp = new MathContainer(this);
        this.children = [this.exp];
    }
    toHTML(cursorPos) {
        const expHTML = this.exp.toHTML(cursorPos && cursorPos.childIndex === 0 ? cursorPos.deepPos : null);
        let cAfter = cursorPos && cursorPos.childIndex === 1 ? '<span class="cursor"></span>' : '';
        return `<span class="power">${expHTML}</span>${cAfter}`;
    }
    toString() { return `^(${this.exp.toString()})`; }
}

class MathContainer extends MathNode {
    constructor(parent = null) {
        super(parent);
        // A container always holds at least one TextNode initially
        this.children = [new TextNode("", this)];
    }

    toHTML(cursorPos) { // cursorPos is an object { nodeIndex: 0, deepPos: 0 }
        if (this.children.length === 1 && this.children[0].text === "" && !cursorPos) {
            return `<span class="empty-box"></span>`;
        }

        let html = "";
        for (let i = 0; i < this.children.length; i++) {
            if (cursorPos && cursorPos.nodeIndex === i) {
                html += this.children[i].toHTML(cursorPos.deepPos);
            } else {
                html += this.children[i].toHTML(null);
            }
        }
        return html;
    }

    toString() {
        return this.children.map(c => c.toString()).join("");
    }
}


class MathEditor {
    constructor(domElement) {
        this.domElement = domElement;
        this.root = new MathContainer(null);

        // Cursor state
        this.activeContainer = this.root;
        this.activeNodeIndex = 0; // index inside activeContainer.children
        this.cursorOffset = 0;    // offset inside the active TextNode
    }

    render() {
        // Reconstruct cursorPos path from activeContainer to root
        let pos = { nodeIndex: this.activeNodeIndex, deepPos: this.cursorOffset };
        let curr = this.activeContainer;

        while (curr !== this.root) {
            const parent = curr.parent; // The structural node (Fraction, Sqrt, etc.)
            const childIndex = parent.children.indexOf(curr);
            const parentContainer = parent.parent; // The container holding the structural node
            const nodeIndex = parentContainer.children.indexOf(parent);

            pos = { nodeIndex: nodeIndex, deepPos: { childIndex: childIndex, deepPos: pos } };
            curr = parentContainer;
        }

        this.domElement.innerHTML = `<div class="math-editor-root">${this.root.toHTML(pos)}</div>`;
    }

    insertText(str) {
        const node = this.activeContainer.children[this.activeNodeIndex];
        if (node instanceof TextNode) {
            node.text = node.text.substring(0, this.cursorOffset) + str + node.text.substring(this.cursorOffset);
            this.cursorOffset += str.length;
        }
        this.render();
    }

    insertStructure(structureNode) {
        // e.g. structureNode = new FractionNode()
        const node = this.activeContainer.children[this.activeNodeIndex];
        const beforeText = node.text.substring(0, this.cursorOffset);
        const afterText = node.text.substring(this.cursorOffset);

        node.text = beforeText;
        const newTextNode = new TextNode(afterText, this.activeContainer);

        structureNode.parent = this.activeContainer;

        // Insert structure node and new text node
        this.activeContainer.children.splice(this.activeNodeIndex + 1, 0, structureNode, newTextNode);

        // Move cursor into the first container of the structure node
        this.activeContainer = structureNode.children[0];
        this.activeNodeIndex = 0;
        this.cursorOffset = 0;

        this.render();
    }

    insertFraction() { this.insertStructure(new FractionNode()); }
    insertSqrt() { this.insertStructure(new SqrtNode()); }
    insertPower() { this.insertStructure(new PowerNode()); }

    moveLeft() {
        if (this.cursorOffset > 0) {
            this.cursorOffset--;
        } else {
            if (this.activeNodeIndex > 0) {
                const prevNode = this.activeContainer.children[this.activeNodeIndex - 1];
                if (prevNode instanceof TextNode) {
                    this.activeNodeIndex--;
                    this.cursorOffset = prevNode.text.length;
                } else if (prevNode instanceof FractionNode) {
                    this.activeContainer = prevNode.den;
                    this.activeNodeIndex = this.activeContainer.children.length - 1;
                    const lastNode = this.activeContainer.children[this.activeNodeIndex];
                    this.cursorOffset = lastNode.text.length;
                } else if (prevNode instanceof SqrtNode || prevNode instanceof PowerNode) {
                    this.activeContainer = prevNode.children[0];
                    this.activeNodeIndex = this.activeContainer.children.length - 1;
                    const lastNode = this.activeContainer.children[this.activeNodeIndex];
                    this.cursorOffset = lastNode.text.length;
                }
            } else {
                // move out of structure
                if (this.activeContainer.parent) {
                    const structNode = this.activeContainer.parent;
                    const structIndex = structNode.parent.children.indexOf(structNode);
                    if (structNode instanceof FractionNode && structNode.children[1] === this.activeContainer) {
                        // Move from den to num
                        this.activeContainer = structNode.num;
                        this.activeNodeIndex = this.activeContainer.children.length - 1;
                        this.cursorOffset = this.activeContainer.children[this.activeNodeIndex].text.length;
                    } else {
                        // Move completely out to the left
                        this.activeContainer = structNode.parent;
                        this.activeNodeIndex = structIndex - 1;
                        this.cursorOffset = this.activeContainer.children[this.activeNodeIndex].text.length;
                    }
                }
            }
        }
        this.render();
    }

    moveRight() {
        const node = this.activeContainer.children[this.activeNodeIndex];
        if (this.cursorOffset < node.text.length) {
            this.cursorOffset++;
        } else {
            if (this.activeNodeIndex < this.activeContainer.children.length - 1) {
                const nextNode = this.activeContainer.children[this.activeNodeIndex + 1];
                if (nextNode instanceof TextNode) {
                    this.activeNodeIndex++;
                    this.cursorOffset = 0;
                } else if (nextNode instanceof FractionNode) {
                    this.activeContainer = nextNode.num;
                    this.activeNodeIndex = 0;
                    this.cursorOffset = 0;
                } else if (nextNode instanceof SqrtNode || nextNode instanceof PowerNode) {
                    this.activeContainer = nextNode.children[0];
                    this.activeNodeIndex = 0;
                    this.cursorOffset = 0;
                }
            } else {
                // move out of structure
                if (this.activeContainer.parent) {
                    const structNode = this.activeContainer.parent;
                    const structIndex = structNode.parent.children.indexOf(structNode);
                    if (structNode instanceof FractionNode && structNode.children[0] === this.activeContainer) {
                        // Move from num to den
                        this.activeContainer = structNode.den;
                        this.activeNodeIndex = 0;
                        this.cursorOffset = 0;
                    } else {
                        // Move completely out to the right
                        this.activeContainer = structNode.parent;
                        this.activeNodeIndex = structIndex + 1;
                        this.cursorOffset = 0;
                    }
                }
            }
        }
        this.render();
    }

    deleteLeft() {
        if (this.cursorOffset > 0) {
            const node = this.activeContainer.children[this.activeNodeIndex];
            node.text = node.text.substring(0, this.cursorOffset - 1) + node.text.substring(this.cursorOffset);
            this.cursorOffset--;
        } else {
            // Complex deletion: deleting structure nodes or moving cursor
            if (this.activeNodeIndex > 0) {
                const prevNode = this.activeContainer.children[this.activeNodeIndex - 1];
                if (!(prevNode instanceof TextNode)) {
                    // Extract contents of struct node and replace struct node
                    let innerContents = "";
                    if (prevNode instanceof FractionNode) innerContents = prevNode.num.toString() + "/" + prevNode.den.toString();
                    if (prevNode instanceof SqrtNode) innerContents = prevNode.arg.toString();
                    if (prevNode instanceof PowerNode) innerContents = prevNode.exp.toString();

                    const textNodeBefore = this.activeContainer.children[this.activeNodeIndex - 2];
                    const textNodeAfter = this.activeContainer.children[this.activeNodeIndex];

                    const beforeLen = textNodeBefore.text.length;
                    textNodeBefore.text += innerContents + textNodeAfter.text;
                    this.cursorOffset = beforeLen + innerContents.length;

                    this.activeContainer.children.splice(this.activeNodeIndex - 1, 2);
                    this.activeNodeIndex -= 2;
                }
            } else if (this.activeContainer.parent) {
                // We are at the beginning of a container inside a structure, move left
                this.moveLeft();
            }
        }
        this.render();
    }

    clear() {
        this.root = new MathContainer(null);
        this.activeContainer = this.root;
        this.activeNodeIndex = 0;
        this.cursorOffset = 0;
        this.render();
    }

    getExpressionString() {
        return this.root.toString();
    }
}
