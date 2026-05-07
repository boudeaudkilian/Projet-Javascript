// ===== CLASSES PERSONNAGES =====
// Constructeur basé sur un objet d'options pour rester lisible et flexible.

class Character {
    constructor({
        name,
        maxHealth,
        strength,
        speed,
        positionx = 0,
        positiony = 0,
        facingR = true,
        attackRangeC = 60,
        attackRangeD = 0,
        attackCooldownC = 600,
        attackCooldownD = 1000,
        canShoot = false,
        kind = "normal", // normal | boss | ultra
        color = null,
    } = {}) {
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
        this.kind           = kind;
        this.color          = color;

        this.isDefending = false;
        this.statusEffects = [];
        this.lastMeleeAt = 0;
        this.lastRangedAt = 0;
        this.isAlive = true;
    }

    isOnCooldownMelee()  { return performance.now() - this.lastMeleeAt  < this.attackCooldownC; }
    isOnCooldownRanged() { return performance.now() - this.lastRangedAt < this.attackCooldownD; }

    reset() {
        this.currentHealth = this.maxHealth;
        this.isAlive = true;
        this.isDefending = false;
        this.lastMeleeAt = 0;
        this.lastRangedAt = 0;
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
            kind: "player",
            color: "#222",
        });
        this.exp   = 0;
        this.level = 1;
        this.ptc   = 1;
    }
}

class Enemy extends Character {
    constructor(opts) {
        super({ facingR: false, kind: "normal", color: "#7d3c3c", ...opts });
        this.isEnemy = true;
    }
}

class Boss extends Enemy {
    constructor(opts) {
        super({ kind: "boss", color: "#4a148c", ...opts });
        this.isBoss = true;
    }
}

class UltraBoss extends Boss {
    constructor(opts) {
        super({ kind: "ultra", color: "#b8860b", ...opts });
        this.isUltra = true;
    }
}

const player = new Player();

// ===== ROSTER ORGANISÉ PAR NIVEAU (5 niveaux) =====
// Inspiré du cahier des charges : difficulté progressive, plusieurs ennemis,
// un boss par niveau, un Ultra Boss au niveau 5.
const LEVELS = [
    {
        id: 1, name: "Niveau 1 — Les Recrues",
        description: "Tes premiers adversaires. Apprends à te défendre.",
        enemies: [
            new Enemy({ name: "Recrue Maladroite", maxHealth: 50, strength: 6, speed: 3,
                attackRangeC: 60, attackCooldownC: 1000, color: "#8b5a3c" }),
            new Enemy({ name: "Vagabond",         maxHealth: 60, strength: 7, speed: 3,
                attackRangeC: 65, attackCooldownC: 950, color: "#6b4226" }),
        ],
        boss: new Boss({ name: "Sergent Bourru", maxHealth: 150, strength: 12, speed: 3,
            attackRangeC: 80, attackCooldownC: 800, color: "#3b1f1f" }),
    },
    {
        id: 2, name: "Niveau 2 — Les Archers",
        description: "Attention aux tirs à distance.",
        enemies: [
            new Enemy({ name: "Archer Apprenti", maxHealth: 70, strength: 8, speed: 3,
                attackRangeC: 55, attackRangeD: 500, attackCooldownC: 900, attackCooldownD: 1600,
                canShoot: true, color: "#2e7d32" }),
            new Enemy({ name: "Vif-Lame",        maxHealth: 90, strength: 10, speed: 5,
                attackRangeC: 70, attackCooldownC: 700, color: "#558b2f" }),
            new Enemy({ name: "Arc Calme",       maxHealth: 80, strength: 11, speed: 3,
                attackRangeC: 60, attackRangeD: 600, attackCooldownC: 900, attackCooldownD: 1400,
                canShoot: true, color: "#33691e" }),
        ],
        boss: new Boss({ name: "Capitaine Sylvestre", maxHealth: 220, strength: 16, speed: 4,
            attackRangeC: 80, attackRangeD: 650, attackCooldownC: 800, attackCooldownD: 1600,
            canShoot: true, color: "#1b5e20" }),
    },
    {
        id: 3, name: "Niveau 3 — Les Colosses",
        description: "Ils encaissent et frappent fort.",
        enemies: [
            new Enemy({ name: "Brute Épaisse",   maxHealth: 130, strength: 14, speed: 2,
                attackRangeC: 75, attackCooldownC: 1100, color: "#5d4037" }),
            new Enemy({ name: "Garde Lourd",     maxHealth: 160, strength: 15, speed: 2,
                attackRangeC: 80, attackCooldownC: 1100, color: "#3e2723" }),
            new Enemy({ name: "Colosse Stable",  maxHealth: 200, strength: 16, speed: 2,
                attackRangeC: 85, attackCooldownC: 1100, color: "#2c1810" }),
        ],
        boss: new Boss({ name: "Titan Imperçable", maxHealth: 380, strength: 22, speed: 3,
            attackRangeC: 90, attackRangeD: 700, attackCooldownC: 1000, attackCooldownD: 1800,
            canShoot: true, color: "#1a0e0a" }),
    },
    {
        id: 4, name: "Niveau 4 — Les Maîtres",
        description: "Vifs, précis, redoutables.",
        enemies: [
            new Enemy({ name: "Lame d'Argent",   maxHealth: 150, strength: 18, speed: 6,
                attackRangeC: 75, attackCooldownC: 600, color: "#283593" }),
            new Enemy({ name: "Tireur d'Élite",  maxHealth: 130, strength: 20, speed: 4,
                attackRangeC: 60, attackRangeD: 750, attackCooldownC: 800, attackCooldownD: 1100,
                canShoot: true, color: "#1a237e" }),
            new Enemy({ name: "Assassin",        maxHealth: 140, strength: 22, speed: 7,
                attackRangeC: 70, attackCooldownC: 550, color: "#0d1b5e" }),
        ],
        boss: new Boss({ name: "Maître des Ombres", maxHealth: 450, strength: 28, speed: 5,
            attackRangeC: 85, attackRangeD: 750, attackCooldownC: 700, attackCooldownD: 1300,
            canShoot: true, color: "#311b92" }),
    },
    {
        id: 5, name: "Niveau 5 — L'Apocalypse",
        description: "Affronte les légendes… puis l'Ultra Boss.",
        enemies: [
            new Enemy({ name: "Champion Déchu",  maxHealth: 200, strength: 24, speed: 5,
                attackRangeC: 80, attackRangeD: 700, attackCooldownC: 650, attackCooldownD: 1200,
                canShoot: true, color: "#880e4f" }),
            new Enemy({ name: "Spectre Hurlant", maxHealth: 220, strength: 26, speed: 6,
                attackRangeC: 75, attackRangeD: 800, attackCooldownC: 600, attackCooldownD: 1100,
                canShoot: true, color: "#4a148c" }),
            new Boss({  name: "Garde du Roi",    maxHealth: 350, strength: 28, speed: 4,
                attackRangeC: 90, attackRangeD: 700, attackCooldownC: 800, attackCooldownD: 1400,
                canShoot: true, color: "#311b92" }),
        ],
        boss: new UltraBoss({ name: "ÆTHER, Roi des Stickmen", maxHealth: 700, strength: 35, speed: 6,
            attackRangeC: 100, attackRangeD: 900, attackCooldownC: 550, attackCooldownD: 1000,
            canShoot: true, color: "#b8860b" }),
    },
];

// Liste à plat utile pour les sélections aléatoires (anciens tests)
const allEnemies = LEVELS.flatMap(l => [...l.enemies, l.boss]);

const getLevel = (id) => LEVELS.find(l => l.id === id) || LEVELS[0];

// Renvoie la séquence ordonnée de combats d'un niveau (ennemis puis boss)
const getLevelSequence = (id) => {
    const lvl = getLevel(id);
    return [...lvl.enemies, lvl.boss];
};

export {
    Character, Player, Enemy, Boss, UltraBoss,
    player, allEnemies, LEVELS, getLevel, getLevelSequence,
};
