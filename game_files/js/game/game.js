const canvas = document.getElementById('canvas_game');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth; //any width//
canvas.height = window.innerHeight; //any height//

ctx.fillRect(0, 0 , canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc: './images/background/soul_background_1.png'
})

const tiles = new Sprite({
    position: {
        x: 0,
        y: 770,
    },
    imageSrc: './images/items/textures_magma.png'
})

const player = new Fighter({
    position: {
        x: 300,
        y: 100,
    },
    velocity: {
        x: 0,
        y: 0,
    },
    offset: {
        x: 215,
        y: 250,
    },
    ult_offset: {
        x: 0,
        y: 0,
    },
    imageSrc: './images/medieval_king/Idle.png',
    scale: 4,
    framesMax: 8,
    sprites: {
        idle: {
            imageSrc: './images/medieval_king/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './images/medieval_king/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './images/medieval_king/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './images/medieval_king/Fall.png',
            framesMax: 2
        },
        base_attack: {
            imageSrc: './images/medieval_king/Attack1.png',
            framesMax: 4
        },
        ultimate_attack: {
            imageSrc: './images/medieval_king/Attack3.png',
            framesMax: 4
        },
        take_base_hit: {
            imageSrc: './images/medieval_king/Take_Hit.png',
            framesMax: 4
        },
        take_ultimate_hit: {
            imageSrc: './images/medieval_king/Take_Hit.png',
            framesMax: 4
        },
        death: {
            imageSrc: './images/medieval_king/Death.png',
            framesMax: 6
        }
    },
    attackBox: {
        offset: {
            x: 200,
            y: 50
        },
        width: 100,
        height: 50,
    },
    ultimateAttackBox: {
        ult_offset: {
            x: 250,
            y: 200
        },
        width: 100,
        height: 50,
    }
})

const enemy = new Fighter({
    position: {
        x: 1400,
        y: 100,
    },
    velocity: {
        x: 0,
        y: 0,
    },
    offset: {
        x: 215,
        y: 250
    },
    ult_offset: {
        x: -250,
        y: 0,
    },
    imageSrc: './images/fantasy_warrior/Idle.png',
    scale: 4,
    framesMax: 10,
    sprites: {
        idle: {
            imageSrc: './images/fantasy_warrior/Idle.png',
            framesMax: 10
        },
        run: {
            imageSrc: './images/fantasy_warrior/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './images/fantasy_warrior/Jump.png',
            framesMax: 3
        },
        fall: {
            imageSrc: './images/fantasy_warrior/Fall.png',
            framesMax: 3
        },
        base_attack: {
            imageSrc: './images/fantasy_warrior/Attack1.png',
            framesMax: 7
        },
        ultimate_attack: {
            imageSrc: './images/fantasy_warrior/Attack3.png',
            framesMax: 8
        },
        take_base_hit: {
            imageSrc: './images/fantasy_warrior/Take_Hit.png',
            framesMax: 3
        },
        take_ultimate_hit: {
            imageSrc: './images/fantasy_warrior/Take_Hit.png',
            framesMax: 3
        },
        death: {
            imageSrc: './images/fantasy_warrior/Death.png',
            framesMax: 7
        }
    },
    attackBox: {
        offset: {
            x: -200,
            y: 50
        },
        width: 200,
        height: 50
    },
    ultimateAttackBox: {
        ult_offset: {
            x: -300,
            y: 200
        },
        width: 300,
        height: 50
    }
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

decreaseTimer();

function animation() {
    window.requestAnimationFrame(animation);
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0, canvas.width, canvas.height);
    background.update();
    tiles.update();
    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    // player movement //
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5;
        player.switchSprite('run');
    } else {
        if (keys.d.pressed && player.lastKey === 'd') {
            player.velocity.x = 5;
            player.switchSprite('run');
        } else {
            player.switchSprite('idle');
        }
    }

    // player jumping //
    if (player.velocity.y < 0) {
        player.switchSprite('jump');
    } else {
        if (player.velocity.y > 0) {
            player.switchSprite('fall');
        }
    }

    // enemy movement //
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5;
        enemy.switchSprite('run');
    } else {
        if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
            enemy.velocity.x = 5;
            enemy.switchSprite('run');
        } else {
            enemy.switchSprite('idle');
        }
    }

    // enemy jumping //
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump');
    } else {
        if (enemy.velocity.y > 0) {
            enemy.switchSprite('fall');
        }
    }

    // detect for collision //
    // player attack & enemy gets hit //
    if (
        rectangularCollision({
            rectangle_1: player,
            rectangle_2: enemy
        }) &&
        player.isAttacking && player.framesCurrent === 2
    ) {
        enemy.take_base_hit();
        player.isAttacking = false;
        document.querySelector('#enemyHealth').style.width = enemy.health + '%';
    }

    // if player missed attack //
    if (player.isAttacking && player.framesCurrent === 2) {
        player.isAttacking = false;
    }

    if (
        rectangularCollisionForUltimate({
            rectangle_1: player,
            rectangle_2: enemy
        }) &&
        player.isUltimateAttacking && player.framesCurrent === 2
    ) {
        enemy.take_ultimate_hit();
        player.isUltimateAttacking = false;
        document.querySelector('#enemyHealth').style.width = enemy.health + '%';
    }

    // if player missed ultimate attack //
    if (player.isUltimateAttacking && player.framesCurrent === 2) {
        player.isUltimateAttacking = false;
    }

    // enemy attack & player gets hit //
    if (
        rectangularCollision({
            rectangle_1: enemy,
            rectangle_2: player
        }) &&
        enemy.isAttacking && enemy.framesCurrent === 2
    ) {
        player.take_base_hit();
        enemy.isAttacking = false;
        document.querySelector('#playerHealth').style.width = player.health + '%';
    }

    // if enemy missed attack //
    if (enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false;
    }

    if (
        rectangularCollisionForUltimate({
            rectangle_1: enemy,
            rectangle_2: player
        }) &&
        enemy.isUltimateAttacking && enemy.framesCurrent === 3
    ) {
        player.take_ultimate_hit();
        enemy.isUltimateAttacking = false;
        document.querySelector('#playerHealth').style.width = player.health + '%';
    }

    // if enemy missed ultimate attack //
    if (enemy.isUltimateAttacking && enemy.framesCurrent === 3) {
        enemy.isUltimateAttacking = false;
    }

    // end game based on players health //
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerId });
    }
}

animation();

// button control //
window.addEventListener('keydown', (event) => {
    // player controls //
    if (!player.dead) {
        switch (event.key) {
            case 'd':
                keys.d.pressed = true;
                player.lastKey = 'd';
                break
            case 'a':
                keys.a.pressed = true;
                player.lastKey = 'a';
                break
            case 'w':
                player.velocity.y = -20;
                break
            case ' ':
                player.attack();
                break
            case 'e':
                player.ultimate_attack();
                break
        }
    }

    // enemy controls //
    if (!enemy.dead) {
        switch (event.key) {
            case 'ArrowRight':
                keys.ArrowRight.pressed = true;
                enemy.lastKey = 'ArrowRight';
                break
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true;
                enemy.lastKey = 'ArrowLeft';
                break
            case 'ArrowUp':
                enemy.velocity.y = -20;
                break
            case 'Home':
                enemy.attack();
                break
            case 'PageUp':
                enemy.ultimate_attack();
                break
        }
    }
})

window.addEventListener('keyup', (event) => {
    // player controls //
    switch (event.key) {
        case 'd':
            keys.d.pressed = false;
            break
        case 'a':
            keys.a.pressed = false;
            break
    }

    // enemy controls //
    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break
    }
})

window.addEventListener('keydown', changeColorSkillsPlayer_1, false);
window.addEventListener('keydown', changeColorSkillsPlayer_2, false);
