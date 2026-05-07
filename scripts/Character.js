class Character {
    constructor(name, maxHealth, strength, speed, positionx = 0, positiony = 0, facingR, attackRengec = 60, attackRenged = 0, attackcoldownc = 600, attackcoldownd = 1000, canshoot = false) {
        this.name          = name;
        this.maxHealth     = maxHealth;
        this.currentHealth = maxHealth;
        this.strength      = strength;
        this.speed         = speed;
        this.positionx     = positionx;
        this.positiony     = positiony;
        this.facingR       = facingR;
        this.attackRengec  = attackRengec;
        this.attackRenged  = attackRenged;
        this.attackcoldownc= attackcoldownc;
        this.attackcoldownd= attackcoldownd;
        this.canshoot      = canshoot;
        this.isDefending = false;
        this.statusEffects = [];
        this.lastMeleeAt = 0;
        this.lastRangedAt = 0;
        this.isAlive = true;
    }

    isOnCooldownMelee() {
        return performance.now() - this.lastMeleeAt < this.attackCooldownC;
    }
    isOnCooldownRanged() {
        return performance.now() - this.lastRangedAt < this.attackCooldownD;
    }
}

class Player extends Character {
    constructor() {
        super({
            name: "Sticky",
            maxHealth: 100,
            strength: 10,
            speed: 6,
            facingR: true,
            attackRangeC: 70,
            attackRangeD: 800,
            attackCooldownC: 400,
            attackCooldownD: 700,
            canShoot: true,
        });
    }
}

class Enemy extends Character {
    constructor(opts) {
        super({ facingR: false, ...opts });
        this.isEnemy = true;
    }
}

class Boss extends Enemy {
    constructor(opts) {
        super(opts);
        this.isBoss = true;
    }
}

// Instances de base
const player = new Player();

const enemy1 = new Enemy({
    name: "Vif-Lame", maxHealth: 80, strength: 8, speed: 4,
    attackRangeC: 70, attackRangeD: 0,
    attackCooldownC: 800, attackCooldownD: 0, canShoot: false,
});
const enemy2 = new Enemy({
    name: "Arc Calme", maxHealth: 70, strength: 10, speed: 2,
    attackRangeC: 60, attackRangeD: 600,
    attackCooldownC: 900, attackCooldownD: 1500, canShoot: true,
});
const enemy3 = new Enemy({
    name: "Colosse Stable", maxHealth: 200, strength: 14, speed: 2,
    attackRangeC: 80, attackRangeD: 0,
    attackCooldownC: 1100, attackCooldownD: 0, canShoot: false,
});
const boss1 = new Boss({
    name: "Titan Imperçable", maxHealth: 400, strength: 22, speed: 2,
    attackRangeC: 90, attackRangeD: 700,
    attackCooldownC: 1000, attackCooldownD: 1800, canShoot: true,
});
const boss2 = new Boss({
    name: "Maître des Ombres", maxHealth: 300, strength: 28, speed: 5,
    attackRangeC: 80, attackRangeD: 700,
    attackCooldownC: 700, attackCooldownD: 1400, canShoot: true,
});

export { Character, Player, Enemy, Boss, player, enemy1, enemy2, enemy3, boss1, boss2 };