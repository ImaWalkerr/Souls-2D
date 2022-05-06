const canvas =document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = innerWidth //any width//
canvas.height = innerHeight //any height//

ctx.fillRect(0, 0 , canvas.width, canvas.height)

const gravity = 0.7

class Sprite {
    constructor({ position, velocity, color = 'red', offset }) {
        this.position = position
        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.lastKey
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset,
            width: 100,
            height: 50,
        }
        this.color = color
        this.isAttacking
    }

    draw () {
        ctx.fillStyle = this.color
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)

        // attack box //
        if (this.isAttacking) {
            ctx.fillStyle = 'green'
            ctx.fillRect(
                this.attackBox.position.x,
                this.attackBox.position.y,
                this.attackBox.width,
                this.attackBox.height
            )
        }
    }

    update () {
        this.draw()

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0
        } else {
            this.velocity.y += gravity
        }
    }

    attack () {
        this.isAttacking = true
        setTimeout(() => {
            this.isAttacking = false
        }, 100)
    }
}

const player = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    velocity: {
        x: 0,
        y: 0,
    },
    offset: {
        x: 0,
        y: 0,
    }
})

const enemy = new Sprite({
    position: {
        x: 400,
        y: 100,
    },
    velocity: {
        x: 0,
        y: 0,
    },
    offset: {
        x: -50,
        y: 0,
    },
    color: 'blue'
})

console.log(player);

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}

function rectangularCollision({ rectangle_1, rectangle_2 }) { // rectangle_1 = player, rectangle_2 = enemy //
    return (
        rectangle_1.attackBox.position.x + rectangle_1.attackBox.width >= rectangle_2.position.x &&
        rectangle_1.attackBox.position.x <= rectangle_2.position.x + rectangle_2.width &&
        rectangle_1.attackBox.position.y + rectangle_1.attackBox.height >= rectangle_2.position.y &&
        rectangle_1.attackBox.position.y <= rectangle_2.position.y + rectangle_2.height
    )
}

function animation() {
    window.requestAnimationFrame(animation)
    ctx.fillStyle = 'black'
    ctx.fillRect(0,0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    // player movement //
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
    } else {
        if (keys.d.pressed && player.lastKey === 'd') {
            player.velocity.x = 5
        }
    }

    // enemy movement //
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
    } else {
        if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
            enemy.velocity.x = 5
        }
    }

    // detect for collision //
    if (
        rectangularCollision({
            rectangle_1: player,
            rectangle_2: enemy
        }) &&
        player.isAttacking
    ) {
        player.isAttacking = false
        console.log('player attack successful')
    }

    if (
        rectangularCollision({
            rectangle_1: enemy,
            rectangle_2: player
        }) &&
        enemy.isAttacking
    ) {
        enemy.isAttacking = false
        console.log('enemy attack successful')
    }
}

animation()

// button control //
window.addEventListener('keydown', (event) => {
    switch (event.key) {
        // player controls //
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            break
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
            break
        case 'w':
            player.velocity.y = -20
            break
        case ' ':
            player.attack()
            break

        // enemy controls //
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break
        case 'ArrowUp':
            enemy.velocity.y = -20
            break
        case 'ArrowDown':
            enemy.isAttacking = true
            break
    }
})

window.addEventListener('keyup', (event) => {
    // player controls //
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
    }

    // enemy controls //
    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
    }
})