"use strict";

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

class Fps {
    constructor() {
        this.prevTime = performance.now();
        this.fps = 0;
        this.frame = 1;
    }
    count = function() {
        const delta = (performance.now() - this.prevTime)/1000;
        this.prevTime = performance.now();
        this.fps = 1 / delta;
        this.frame++;
    }
    frameRate = function() {
        return this.fps;
    }
};


window.addEventListener('resize', resizeCanvas, false);

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.onload = () => {
    resizeCanvas();
    if (typeof preload === "function") preload();
    if (typeof setup === "function") setup();
    if (typeof draw === "function") draw();
}
