class Sprite {
    constructor({
        position,
        imageSrc,
        scale = 1,
        framesMax = 1,
        offset = {x: 0, y: 0}
    }) {
        this.position = position;
        this.width = 50;
        this.height = 150;
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale;
        this.framesMax = framesMax;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 10;
        this.offset = offset;
    }

    draw () {
        ctx.drawImage(
            this.image,
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            (this.image.width / this.framesMax) * this.scale,
            this.image.height * this.scale
        )
    }

    animateFrames () {
        this.framesElapsed++;

        if (this.framesElapsed % this.framesHold === 0) {
            if (this.framesCurrent < this.framesMax - 1) {
            this.framesCurrent++;
            } else {
                this.framesCurrent = 0;
            }
        }
    }

    update () {
        this.draw();
        this.animateFrames();
    }
}

class Fighter extends Sprite {
    constructor({
        position,
        velocity,
        ult_offset,
        imageSrc,
        scale = 1,
        framesMax = 1,
        offset = {x: 0, y: 0},
        sprites,
        attackBox = {
            offset: {},
            width: undefined,
            height: undefined
        },
        ultimateAttackBox = {
            ult_offset: {},
            width: undefined,
            height: undefined
        }
    }) {
        super ({
            position,
            imageSrc,
            scale,
            framesMax,
            offset
        })
        this.velocity = velocity;
        this.width = 50;
        this.height = 150;
        this.lastKey;
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height,
        }
        this.UltimateAttackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            ult_offset: ultimateAttackBox.ult_offset,
            width: ultimateAttackBox.width,
            height: ultimateAttackBox.height,
        }
        this.isAttacking;
        this.isUltimateAttacking;
        this.health = 100;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 10;
        this.sprites = sprites;
        this.dead = false;

        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }
    }

    update () {
        this.draw();
        if (!this.dead)
            this.animateFrames();

        // attack boxes //
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y;

        // if needed draw attackBox //
        //ctx.fillRect(
        //    this.attackBox.position.x,
        //    this.attackBox.y,
        //    this.attackBox.width,
        //    this.attackBox.height
        //)

        this.UltimateAttackBox.position.x = this.position.x + this.UltimateAttackBox.ult_offset.x;
        this.UltimateAttackBox.position.y = this.position.y;

        // if needed draw UltimateAttackBox //
        //ctx.fillRect(
        //    this.UltimateAttackBox.position.x,
        //    this.UltimateAttackBox.y,
        //    this.UltimateAttackBox.width,
        //    this.UltimateAttackBox.height
        //)

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // gravity function //
        if (this.position.y + this.height + this.velocity.y >= canvas.height - 200) {
            this.velocity.y = 0;
            this.position.y = 620;
        } else {
            this.velocity.y += gravity;
        }
    }

    attack () {
        this.switchSprite('base_attack');
        this.isAttacking = true;
    }

    ultimate_attack () {
        this.switchSprite('ultimate_attack');
        this.isUltimateAttacking = true;
    }

    take_base_hit () {
        this.health -=1;

        if (this.health <= 0) {
            this.switchSprite('death');
        } else this.switchSprite('take_base_hit');
    }

    take_ultimate_hit() {
        this.health -=5;

        if (this.health <= 0) {
            this.switchSprite('death');
        } else this.switchSprite('take_ultimate_hit');
    }

    switchSprite (sprite) {
        // overriding all other animations with the death animation //
        if (this.image === this.sprites.death.image) {
            if (this.framesCurrent === this.sprites.death.framesMax - 1)
                this.dead = true;
            return;
        }

        // overriding all other animations with the attack animation //
            if (
                this.image === this.sprites.base_attack.image &&
                this.framesCurrent < this.sprites.base_attack.framesMax -1
            )
                return;
                else
                if (
                    this.image === this.sprites.ultimate_attack.image &&
                    this.framesCurrent < this.sprites.ultimate_attack.framesMax -1
                )
                    return;

                // override when fighter gets hit //
                if (
                    this.image === this.sprites.take_base_hit.image &&
                    this.framesCurrent < this.sprites.take_base_hit.framesMax -1
                )
                    return;
                    else
                    if (
                        this.image === this.sprites.take_ultimate_hit.image &&
                        this.framesCurrent < this.sprites.take_ultimate_hit.framesMax -1
                    )
                        return;

        switch (sprite) {
            case 'idle':
                if (this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image;
                    this.framesMax = this.sprites.idle.framesMax;
                    this.framesCurrent = 0;
                }
                break
            case 'run':
                if (this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image;
                    this.framesMax = this.sprites.run.framesMax;
                    this.framesCurrent = 0;
                }
                break
            case 'jump':
                if (this.image !== this.sprites.jump.image) {
                    this.image = this.sprites.jump.image;
                    this.framesMax = this.sprites.jump.framesMax;
                    this.framesCurrent = 0;
                }
                break
            case 'fall':
                if (this.image !== this.sprites.fall.image) {
                    this.image = this.sprites.fall.image;
                    this.framesMax = this.sprites.fall.framesMax;
                    this.framesCurrent = 0;
                }
                break
            case 'base_attack':
                if (this.image !== this.sprites.base_attack.image) {
                    this.image = this.sprites.base_attack.image;
                    this.framesMax = this.sprites.base_attack.framesMax;
                    this.framesCurrent = 0;
                }
                break
            case 'ultimate_attack':
                if (this.image !== this.sprites.ultimate_attack.image) {
                    this.image = this.sprites.ultimate_attack.image;
                    this.framesMax = this.sprites.ultimate_attack.framesMax;
                    this.framesCurrent = 0;
                }
                break
            case 'take_base_hit':
                if (this.image !== this.sprites.take_base_hit.image) {
                    this.image = this.sprites.take_base_hit.image;
                    this.framesMax = this.sprites.take_base_hit.framesMax;
                    this.framesCurrent = 0;
                }
                break
            case 'take_ultimate_hit':
                if (this.image !== this.sprites.take_ultimate_hit.image) {
                    this.image = this.sprites.take_ultimate_hit.image;
                    this.framesMax = this.sprites.take_ultimate_hit.framesMax;
                    this.framesCurrent = 0;
                }
                break
            case 'death':
                if (this.image !== this.sprites.death.image) {
                    this.image = this.sprites.death.image;
                    this.framesMax = this.sprites.death.framesMax;
                    this.framesCurrent = 0;
                }
                break
        }
    }
}