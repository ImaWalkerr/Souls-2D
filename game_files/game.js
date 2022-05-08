const canvas =document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = innerWidth //any width//
canvas.height = innerHeight //any height//

ctx.fillRect(0, 0 , canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc: './images/background/background_1.png'
})

const shop = new Sprite({
    position: {
        x: 1250,
        y: 370  ,
    },
    imageSrc: './images/background/shop.png',
    scale: 3,
    framesMax: 6
})

const player = new Fighter({
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
    },
    ult_offset: {
        x: 0,
        y: 0,
    }
})

const enemy = new Fighter({
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
    ult_offset: {
        x: -250,
        y: 0,
    },
    color: 'blue'
})

console.log(player);
console.log(enemy);

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

decreaseTimer()

function animation() {
    window.requestAnimationFrame(animation)
    ctx.fillStyle = 'black'
    ctx.fillRect(0,0, canvas.width, canvas.height)
    background.update()
    shop.update()
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
        enemy.health -= 15
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    }

    if (
        rectangularCollision({
            rectangle_1: enemy,
            rectangle_2: player
        }) &&
        enemy.isAttacking
    ) {
        enemy.isAttacking = false
        player.health -= 15
        document.querySelector('#playerHealth').style.width = player.health + '%'
    }

    if (
        rectangularCollisionForUltimate({
            rectangle_1: player,
            rectangle_2: enemy
        }) &&
        player.isUltimateAttacking
    ) {
        player.isUltimateAttacking = false
        enemy.health -= 30
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    }

    if (
        rectangularCollisionForUltimate({
            rectangle_1: enemy,
            rectangle_2: player
        }) &&
        enemy.isUltimateAttacking
    ) {
        enemy.isUltimateAttacking = false
        player.health -= 30
        document.querySelector('#playerHealth').style.width = player.health + '%'
    }

    // end game based on players health //
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerId })
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
        case 'e':
            player.ultimate_attack()
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
        case '':
            enemy.velocity.y = -20
            break
        case 'Home':
            enemy.attack()
            break
        case 'PageUp':
            enemy.ultimate_attack()
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

window.addEventListener('keydown', changeColorSkillsPlayer_1, false);
window.addEventListener('keydown', changeColorSkillsPlayer_2, false);

