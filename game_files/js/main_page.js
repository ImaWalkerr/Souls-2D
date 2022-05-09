const canvas = document.getElementById('canvas_main');
const ctx = canvas.getContext('2d');

canvas.height = window.innerHeight //any height//
canvas.width = window.innerWidth //any width//

let particlesArray = [];
const numberOfParticles = 200;
ctx.lineCap = 'round';

const mouse = {
    x: null,
    y: null
}

window.addEventListener('mousemove', function (e) {
    mouse.x = e.x;
    mouse.y = e.y;
});

// drop item //
const dino = new Image();
dino.src = './images/items/flag_of_bhutan.png';

// gradient //
let gradient = ctx.createLinearGradient(0,0,0, canvas.height);
gradient.addColorStop(0, 'white');
gradient.addColorStop(0.7, 'mediumpurple');
gradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');

// item settings //
class Particle {
    constructor() {
        this.radius = Math.random() * 200 + 20;
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + this.radius * 2; // random spawn - Math.random() * (canvas.height + this.radius * 2);
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 5 + 1;
        this.angle = Math.random() * 360;
        this.spin = Math.random() < 0.5 ? 1 : -1;
        this.frameX = Math.floor(Math.random() * 3);
        this.frameY = Math.floor(Math.random() * 3);
        this.spriteSize = 900/3;
    }
    update () {
        this.angle += 5;
        this.x += this.speedX;
        this.y -= this.speedY;
        if (this.radius > 1) this.radius -= 0.5;
    }
    draw () {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle * Math.PI/360 * this.spin);
        ctx.drawImage(
            dino,
            this.frameX * this.spriteSize,
            this.frameY * this.spriteSize,
            this.spriteSize,
            this.spriteSize,
            0 - this.radius/2,
            0 - this.radius/2,
            this.radius,
            this.radius
        );
        ctx.translate(-this.x, -this.y);
        ctx.restore();
    }
}

function init() {
    for (let i =0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle);
    }
}
init();

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (particlesArray.length < numberOfParticles) {
        particlesArray.push(new Particle);
    }
    connect();
    for (let i = 0; i < particlesArray.length; i++) {
        if (particlesArray[i].radius <= 1) {
            particlesArray.splice(i, 1);
        }
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    requestAnimationFrame(animate);
}
animate();

// connect items with player mouse //
function connect() {
    for (let i = 0; i < particlesArray.length; i++) {
        ctx.strokeStyle = gradient;
        ctx.lineWidth = particlesArray[i].radius/10;
        ctx.beginPath();
        ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
        ctx.closePath();
    }
}