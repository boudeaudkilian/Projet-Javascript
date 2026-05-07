class Character {
    constructor(name, maxHealth, strength, speed, positionx = 0, positiony = 0, facingR = true, attackRangeC = 60, attackRangeD = 0, attackCooldownC = 600, attackCooldownD = 1000, canShoot = false) {
        this.name           = name;
        this.maxHealth      = maxHealth;
        this.currentHealth  = maxHealth;
        this.strength       = strength;
        this.speed          = speed;
        this.positionx      = positionx;
        this.positiony      = positiony;
        this.facingR        = facingR;
        this.attackRangeC   = attackRangeC;
        this.attackRangeD   = attackRangeD;
        this.attackCooldownC= attackCooldownC;
        this.attackCooldownD= attackCooldownD;
        this.canShoot       = canShoot;
        this.isDefending    = false;
        this.statusEffects  = [];
        this.lastMeleeAt    = 0;
        this.lastRangedAt   = 0;
        this.isAlive        = true;
        this.level          = 1;
        this.exp            = 0;
        this.ptc            = 1;
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
        super("Sticky", 100, 10, 6, 0, 0, true, 70, 800, 400, 700, true);
    }
}

class Enemy extends Character {
    constructor(name, maxHealth, strength, speed, attackRangeC, attackRangeD, attackCooldownC, attackCooldownD, canShoot) {
        super(name, maxHealth, strength, speed, 0, 0, false, attackRangeC, attackRangeD, attackCooldownC, attackCooldownD, canShoot);
        this.isEnemy = true;
    }
}

class Boss extends Enemy {
    constructor(name, maxHealth, strength, speed, attackRangeC, attackRangeD, attackCooldownC, attackCooldownD, canShoot) {
        super(name, maxHealth, strength, speed, attackRangeC, attackRangeD, attackCooldownC, attackCooldownD, canShoot);
        this.isBoss = true;
    }
}

const player  = new Player();
const enemy1  = new Enemy("Vif-Lame",         80,  8,  4,  70,   0,  800,    0, false);
const enemy2  = new Enemy("Arc Calme",         70, 10,  2,  60, 600,  900, 1500,  true);
const enemy3  = new Enemy("Colosse Stable",   200, 14,  2,  80,   0, 1100,    0, false);
const boss1   = new Boss ("Titan Imperçable", 400, 22,  2,  90, 700, 1000, 1800,  true);
const boss2   = new Boss ("Maître des Ombres",300, 28,  5,  80, 700,  700, 1400,  true);

export { Character, Player, Enemy, Boss, player, enemy1, enemy2, enemy3, boss1, boss2 };