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

    reset() {
    this.currentHealth = this.maxHealth;
    this.isAlive       = true;
    this.isDefending   = false;
    this.lastMeleeAt   = 0;
    this.lastRangedAt  = 0;
    }
}

class Player extends Character {
    constructor() {
        super("Sticky", 100, 10, 6, 0, 0, true, 70, 800, 400, 700, false);
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

const allEnemies = [enemy1, enemy2, enemy3, boss1, boss2];

const LEVELS = [
    { id: 1, name: "Les Ruines",        description: "Découverte du combat",    enemies: [enemy1, enemy2], boss: boss1 },
    { id: 2, name: "La Forêt Maudite",  description: "Découverte des attaques à distance",    enemies: [enemy2, enemy3], boss: boss2 },
    { id: 3, name: "Les Cavernes",      description: "PV et dégâts en hausse",  enemies: [enemy1, enemy3], boss: boss1 },
    { id: 4, name: "Le Château",        description: "Boss agressifs",          enemies: [enemy2, enemy3], boss: boss2 },
    { id: 5, name: "L'Abîme Final",     description: "Seuls les plus forts...", enemies: [boss1, boss2],   boss: boss2 },
];

const getLevel = (id) => LEVELS.find(l => l.id === id) || LEVELS[0];

const getLevelSequence = (id) => {
    const lvl = getLevel(id);
    return [...lvl.enemies, lvl.boss];
};

export { Character, Player, Enemy, Boss, player, allEnemies, enemy1, enemy2, enemy3, boss1, boss2, LEVELS, getLevel, getLevelSequence };