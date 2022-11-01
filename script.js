"use strict";

let ctrl = new Ctrl();

const gradient = [
    "#ffffff", "#fbfbfc", "#f7f6f8", "#f2f2f5", "#eeeef1", "#eaeaee", "#e6e6eb", "#e2e1e7",
    "#dedde4", "#d9d9e0", "#d5d5dd", "#d1d1da", "#cdcdd6", "#c9c9d3", "#c5c4d0", "#c1c0cc",
    "#bdbcc9", "#b9b8c6", "#b5b4c3", "#b1b0bf", "#adacbc", "#a9a8b9", "#a5a4b6", "#a1a0b2",
    "#9d9caf", "#9999ac", "#9595a9", "#9191a5", "#8e8da2", "#8a899f", "#86859c", "#828299",
    "#7e7e96", "#7a7a93", "#77768f", "#73738c", "#6f6f89", "#6b6b86", "#686883", "#646480",
    "#646480", "#62627f", "#61617d", "#5f5f7c", "#5e5e7b", "#5c5c7a", "#5a5a79", "#595977",
    "#575776", "#565575", "#545474", "#535272", "#515171", "#504f70", "#4e4e6f", "#4c4c6d",
    "#4b4a6c", "#49496b", "#48476a", "#464668", "#454467", "#434366", "#424165", "#404063",
    "#3f3e62", "#3d3d61", "#3c3b60", "#3a3a5f", "#39385d", "#37375c", "#36355b", "#34345a",
    "#333258", "#313157", "#302f56", "#2e2e55", "#2d2c54", "#2b2b52", "#2a2951", "#282850",
];

class Grid {
    constructor(screen_w, screen_h, step) {
        this.screen_w = screen_w;
        this.screen_h = screen_h;
        this.step_r = Math.floor(screen_w / step);
        this.step_c = Math.floor(screen_h / step);
        this.rows = Math.floor(screen_w / this.step_r);
        this.cols = Math.floor(screen_h / this.step_c);
        this.arr = new Array(this.rows * this.cols);
        this.arr.fill(0);
        this.noise = new Array(this.rows * this.cols);
        this.noise.fill(0);
        this.noise_max = 0;
    }

    #idxToPos = function(idx) {
        return [ Math.floor(idx / this.rows), idx % this.rows ];
    }

    #posToIdx = function(x, y) {
        return y * this.rows + x;
    }

    animate = function() {
        let center_x = this.screen_w / 2;
        this.arr.forEach((v, i) => {
            let [y, x] = this.#idxToPos(i);
            this.arr[i] = rotateX(center_x - (x * this.step_r), (y * this.step_c));

            let r;
            if (ctrl.algorithm == 'perlin') {
                this.noise_max = Math.ceil(ctrl.height);
                r = map(noise.perlin2(x / 50 +xt , y / 50 + yt), 0, this.noise_max);
            } else {
                this.noise_max = Math.ceil(ctrl.height);
                r = map(noise.simplex2(x / 50 +xt , y / 50 + yt), 0, this.noise_max);
            }
            this.noise[i] = r;
        });
    }

    #noiseHeight = function(idx) {
        return this.arr[idx][1] + this.noise[idx];
    }

    #noiseColor = function(idx) {
        let col = this.noise[idx];
        col += this.noise_max;
        return gradient[Math.floor(mapValues(col, [0, this.noise_max * 2], [0, gradient.length]))];
    }

    draw = function() {
        for (let c = 0; c < this.cols - 1; c++) {
            for (let r = 0; r < this.rows; r++) {
                const idx0 = c * this.rows + r;
                const idx1 = idx0 + this.rows;
                let p0 = [ this.arr[idx0][0], this.#noiseHeight(idx0) ];
                let p1 = [ this.arr[idx1][0], this.#noiseHeight(idx1) ];

                ctx.beginPath();
                ctx.globalAlpha = 0.7;
                ctx.moveTo(p0[0], p0[1]);
                ctx.lineTo(p1[0], p1[1]);

                let col = this.noise[idx0] + 400;
                const v = Math.floor(mapValues(col, [0, 600], [0, 255])).toString(16)
                ctx.strokeStyle = this.#noiseColor(idx0);
                ctx.stroke();
            }
        }

        for (let c = 0; c < this.cols; c++) {
            for (let r = 0; r < this.rows - 1; r++) {
                const idx0 = c * this.rows + r;
                const idx1 = idx0 + 1;
                let p0 = [ this.arr[idx0][0], this.#noiseHeight(idx0) ];
                let p1 = [ this.arr[idx1][0], this.#noiseHeight(idx1) ];

                ctx.beginPath();
                ctx.globalAlpha = 0.7;
                ctx.moveTo(p0[0], p0[1]);
                ctx.lineTo(p1[0], p1[1]);
                ctx.strokeStyle = this.#noiseColor(idx0);

                ctx.stroke();
            }
        }
    }
}


function rotateX(x, y, angle = -20) {
    let fov = 200;
    let viewDist = 350;
    const rad = angle * Math.PI / 180;

    let sa = Math.sin(rad);
    let rz = y * sa;
    let f = fov / (viewDist + rz);
    x = x * f + canvas.width / 2;

    let ca = Math.cos(rad);
    let ry = y * ca;
    y = ry * f;

    return [x, y];
}

function mapValues(value, oldRange, newRange) {
    var newValue = (value - oldRange[0]) * (newRange[1] - newRange[0]) / (oldRange[1] - oldRange[0]) + newRange[0];
    return Math.min(Math.max(newValue, newRange[0]) , newRange[1]);
}

function map(val, min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(val * (max - min + 1)) + min;
}


let grid;
function setup() {
    noise.seed(Math.random());

    const step = 50;
    grid = new Grid(canvas.width, canvas.height, step);
}

let xt = 0;
let yt = 0;
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    grid.animate();
    grid.draw();
    xt += ctrl.xspeed;
    yt += ctrl.yspeed;
    ctrl.tick();
    requestAnimationFrame(draw);
}

