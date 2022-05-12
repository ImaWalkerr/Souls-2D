// canvas game settings //
const canvas = document.getElementById('canvas_game');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth; //any width//
canvas.height = window.innerHeight; //any height//

//ctx.fillRect(0, 0 , canvas.width, canvas.height);

// canvas background settings //
const canvas_background = document.getElementById('canvas_background');
const ctx_background = canvas.getContext('2d');

canvas_background.width = window.innerWidth; //any width//
canvas_background.height = window.innerHeight; //any height//

let Bubbles = [];
let BgBubbles = [];

function addBubble() {
    Bubbles.push(new Bubble ('purple', 1.8));
}

function addBgBubble() {
    BgBubbles.push(new Bubble ('red', 2.5));
}

class Bubble {
    constructor(color, ySpeed) {
        this.radius = (Math.random() * 150) + 30;
        this.life = true;
        this.x = (Math.random() * window.innerWidth);
        this.y = (Math.random() * 20) + window.innerHeight + this.radius;
        this.vy = ((Math.random() * 0.0002) + 0.001) + ySpeed;
        this.vr = 0;
        this.vx = (Math.random() * 4) - 2;
        this.color = color;
    }
    update () {
        this.vy += 0.00001;
        this.vr += 0.02;
        this.y -= this.vy;
        this.x += this.vx;
        if (this.radius > 1) {
            this.radius -= this.vr;
        }
        if (this.radius <= 1) {
            this.life = false;
        }
    }
    draw(currentCanvas) {
         currentCanvas.beginPath();
         currentCanvas.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
         currentCanvas.fillStyle = this.color;
         currentCanvas.fill();
    }
}

function handleBubbles() {
    for (let i = Bubbles.length - 1; i >= 0; i--) {
        Bubbles[i].update();
        if (!Bubbles[i].life) {
            Bubbles.splice(i, 1);
        }
    }
    for (let i = BgBubbles.length - 1; i >=0; i--) {
        BgBubbles[i].update();
        if (!BgBubbles[i].life) {
            BgBubbles.splice(i, 1);
        }
    }
    if (Bubbles.length < (window.innerWidth / 4)) {
        addBubble();
    }
    if (BgBubbles.length < (window.innerWidth / 12)) {
        addBgBubble();
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx_background.clearRect(0, 0, canvas.width, canvas.height);

    handleBubbles();

    for (let i = BgBubbles.length -1; i >= 0; i--) {
        BgBubbles[i].draw(ctx_background);
    }
    for (let i = Bubbles.length -1; i >= 0; i--) {
        Bubbles[i].draw(ctx);
    }

    requestAnimationFrame(animate);
}

window.addEventListener('load', animate);

window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas_background.width = window.innerWidth;
    canvas_background.height = window.innerHeight;
    let Bubbles = [];
    let BgBubbles = [];
});