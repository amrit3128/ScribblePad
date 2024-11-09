
const $ = _ => document.querySelector(_)
const $$ = _ => document.querySelectorAll(_)
let _;
const fori = (init, stop, inc, fn) => {
    for (let i = init; i < stop; i += inc) {
        fn(i);
    }
}
const repeat = (times, fn) => {
    for (let i = 0; i < times; i++) {
        fn(i);
    }
}

class Turtle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.angle = 0;
        this._penDown = true;
    }

    forward(distance) {
        const x = this.x + distance * Math.cos(this.angle);
        const y = this.y + distance * Math.sin(this.angle);
        if (this._penDown) {
            _.beginPath();
            _.moveTo(this.x, this.y);
            _.lineTo(x, y);
            _.stroke();
        }
        this.x = x;
        this.y = y;
    }

    backward(distance) {
        this.forward(-distance);
    }

    left(angle) {
        this.angle += angle * Math.PI / 180;
    }

    right(angle) {
        this.angle -= angle * Math.PI / 180;
    }

    // penUp() {
    //     this._penDown = false;
    // }

    // penDown() {
    //     this._penDown = true;
    // }
}

function highlightSyntax() {
    // Save the current cursor position
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const startOffset = range.startOffset;
    const endOffset = range.endOffset;

    // Restore the cursor position
    const newRange = document.createRange();
    newRange.setStart($('#editor').childNodes[0], startOffset);
    newRange.setEnd($('#editor').childNodes[0], endOffset);
    selection.removeAllRanges();
    selection.addRange(newRange);
}

window.appendToEditor = (text) => {
    $('#editor').textContent += '\n' + text + '\n';
}

document.addEventListener('DOMContentLoaded', () => {
    /** @type {HTMLCanvasElement} */
    const canvas = $('canvas');

    const parent = canvas.parentElement;
    canvas.width = parent?.clientWidth ?? canvas.width;
    canvas.height = parent?.clientHeight ?? canvas.height;

    const toolCanvas = $('#tools')
    toolCanvas.width = parent?.clientWidth ?? toolCanvas.width;
    toolCanvas.height = parent?.clientHeight ?? toolCanvas.height;

    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error('Canvas not supported');

    const addedFns = {
        width: canvas.width,
        height: canvas.height,
        circle: (x, y, r) => {
            const path = new Path2D();
            path.arc(x, y, r, 0, Math.PI * 2);
            return path;
        },
        color: (fillC, strokeC) => {
            ctx.fillStyle = fillC ?? ctx.fillStyle;
            ctx.strokeStyle = strokeC ?? ctx.strokeStyle;
        },
        turtle: (x, y) => {
            x = x ?? _.width / 2;
            y = y ?? _.height / 2;

            return new Turtle(x, y);
        }
    };
    Object.assign(ctx, addedFns);
    _ = ctx;

    $('#run').addEventListener('click', () => {
        const code = $('#editor').textContent;
        const exe = new Function(code)
        exe()
    })

    $('#runcmd').addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            const code = $('#runcmd').textContent;
            const exe = new Function(code)
            exe()
        }
    })

    $('#editor').textContent =
        `
// Grid
/*
_.color('gray');
fori(20, _.height, 40, j => {
    fori(20, _.width, 40, i => {
        _.fill(_.circle(i, j, 3)); 
    })
})
*/

// Turtle
_.color('black');
const t = _.turtle();
fori(0, 32, 1, i => {
    repeat(i, () => {
        t.forward(i);
        t.right(358 / i);
    });
    t.backward(Math.sqrt(i));
});


    `

    toolCanvas.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        $('#coords').textContent = `X: ${x.toFixed(0)}, Y: ${y.toFixed(0)}`;
    });
});

