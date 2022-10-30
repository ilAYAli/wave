"use strict";

let fps = new Fps();

let opt_algorithm;
function getAlgorithm() {
    opt_algorithm = localStorage.getItem("wave:algorithm") || "perlin";
    console.log("get:", opt_algorithm);
    let elt = document.getElementById("algolist");
    elt.value = opt_algorithm;
}
function setAlgorithm() {
    const name = document.getElementById("algolist").value
    console.log("set:", name);
    opt_algorithm = name;
    localStorage.setItem("wave:algorithm", name);
    // localStorage.removeItem("wave:algorithm");
}

let opt_speed = -3 / 1000;
let xs = document.getElementById("speed");
xs.oninput = function() {
    opt_speed = Number(xs.value) / 1000;
}

let opt_height = 300;
let xh = document.getElementById("height");
xh.oninput = function() {
    opt_height = Number(xh.value);
}


let p_fps = document.getElementById("p_fps");
let p_speed = document.getElementById("p_speed");
let p_height = document.getElementById("p_height");

var ctrl = ctrl || {};
ctrl.controls_tick = (function() {
    fps.count();

    p_fps.innerText = "fps: " + Math.floor(fps.frameRate());
    p_speed.innerText = "speed: " + opt_speed;
    p_height.innerText = "height: " + opt_height;
});

