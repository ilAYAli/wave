"use strict";

class Ctrl {
    constructor() {
        this.db = "wave:storage";
        this.algorithm = this.#loadValue("algorithm");
        this.speed = Number(this.#loadValue("speed"));
        this.height = Number(this.#loadValue("height"));

        this.p_speed = document.getElementById("p_speed");
        this.p_height = document.getElementById("p_height");
        this.p_fps = document.getElementById("p_fps");
        this.fps = new Fps();

        if (this.speed) this.setSpeed(this.speed);
        if (this.height) this.setHeight(this.height);
        if (this.algorithm) this.setAlgorithm(this.algorithm);
    }

    #storeValue = function(k, v) {
        let jd = JSON.parse(localStorage.getItem(this.db)) || {};
        jd[k] = v;
        localStorage.setItem(this.db, JSON.stringify(jd));
    }

    #loadValue = function(k) {
        let jd = JSON.parse(localStorage.getItem(this.db)) || {};
        return jd[k] || "";
    }

    setSpeed = function(value) {
        const key = "speed";
        let elt = document.getElementById(key);
        elt.value = value;
        this[key] = Number(value) / 1000;
        this.#storeValue(key, value);
    }

    setHeight = function(value) {
        const key = "height";
        let elt = document.getElementById(key);
        elt.value = value;
        this[key] = Number(value);
        this.#storeValue(key, this[key]);
    }

    setAlgorithm = function(value) {
        const key = "algorithm";
        let elt = document.getElementById(key);
        elt.value = value;
        this[key] = value;
        this.#storeValue(key, this[key]);
    }

    printStorage = function() {
        return JSON.stringify(JSON.parse(localStorage.getItem(this.db)), null, 4)
    }

    clearStorage = function() {
        localStorage.removeItem(this.db);
    }

    tick = function() {
        this.p_speed.innerText = "speed: " + this.speed;
        this.p_height.innerText = "height: " + this.height;

        this.fps.count();
        //this.p_fps.innerText = "fps: " + Math.floor(this.fps.frameRate());
    }
}

