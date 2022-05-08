function rectangularCollision({ rectangle_1, rectangle_2 }) { // rectangle_1 = player, rectangle_2 = enemy //
    return (
        rectangle_1.attackBox.position.x + rectangle_1.attackBox.width >= rectangle_2.position.x &&
        rectangle_1.attackBox.position.x <= rectangle_2.position.x + rectangle_2.width &&
        rectangle_1.attackBox.position.y + rectangle_1.attackBox.height >= rectangle_2.position.y &&
        rectangle_1.attackBox.position.y <= rectangle_2.position.y + rectangle_2.height
    )
}

function rectangularCollisionForUltimate({ rectangle_1, rectangle_2 }) {
    return (
        rectangle_1.UltimateAttackBox.position.x + rectangle_1.UltimateAttackBox.width >= rectangle_2.position.x &&
        rectangle_1.UltimateAttackBox.position.x <= rectangle_2.position.x + rectangle_2.width &&
        rectangle_1.UltimateAttackBox.position.y + rectangle_1.UltimateAttackBox.height >= rectangle_2.position.y &&
        rectangle_1.UltimateAttackBox.position.y <= rectangle_2.position.y + rectangle_2.height
    )
}

function determineWinner ({ player, enemy, timerId }) {
    clearTimeout(timerId)
    document.querySelector('#displayText').style.display = 'flex'
    if (player.health === enemy.health) {
        document.querySelector('#displayText').innerHTML = 'DRAW'
    } else if (player.health > enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Player 1 Wins'
    }
    else if (player.health < enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Player 2 Wins'
    }
}

// round timer //
let timer = 60
let timerId
function decreaseTimer() {
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000)
        timer--
        document.querySelector('#timer').innerHTML = timer
    }
    // end game based on time //
    if (timer === 0) {
        determineWinner({ player, enemy, timerId })
    }
}

// change block color when activating skill//
let i = 0,
    skill_player_1 = document.querySelectorAll('.player_1__skill'),
    skill_player_2 = document.querySelectorAll('.player_2__skill'),
    color = document.querySelector('.color');

if (i == 0) {
    skill_player_1[i].className = 'player_1__active-skill';
    skill_player_2[i+1].className = 'player_2__active-skill';
}

function changeColorSkillsPlayer_1(event) {
    if (event.key == 'e') {
        if (i < 2) {
            i++;
            let el = i-1;
            skill_player_1[i].className = 'player_1__active-skill';
            skill_player_1[el].className = 'player_1__skill';
        }
    }
    if (event.key == ' ') {
        if (i > 0) {
            i--;
            var el = i+1;
            skill_player_1[i].className = 'player_1__active-skill';
            skill_player_1[el].className = 'player_1__skill';
        }
    }
}

function changeColorSkillsPlayer_2(event) {
    if (event.key == 'Home') {
        if (i < 2) {
            i++;
            let el = i-1;
            skill_player_2[i].className = 'player_2__active-skill';
            skill_player_2[el].className = 'player_2__skill';
        }
    }
    if (event.key == 'PageUp') {
        if (i > 0) {
            i--;
            var el = i+1;
            skill_player_2[i].className = 'player_2__active-skill';
            skill_player_2[el].className = 'player_2__skill';
        }
    }
}