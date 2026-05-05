class Character {
    constructor(name, maxHealth, strength, speed, positionx, positiony, facingR, attackRengec = 1, attackRenged = 5, attackcoldownc = 1, attackcoldownd = 1, canshoot = false) {
        this.name          = name;
        this.maxHealth     = maxHealth;
        this.currentHealth = maxHealth;
        this.strength      = strength;
        this.speed         = speed;
        this.positionx     = positionx;
        this.positiony     = positiony;
        this.statusEffects = [];
        this.facingR       = facingR;
        this.attackRengec  = attackRengec;
        this.attackRenged  = attackRenged;
        this.attackcoldownc= attackcoldownc;
        this.attackcoldownd= attackcoldownd;
        this.canshoot      = canshoot;
    }
}

class Player extends Character {
    constructor(level = 1, exp = 0, ptc = 1) {
        super("Sticky", 100, 5, 10, 0, 0, true, 1, 0, 1, 0, false);
        this.level = level;
        this.exp   = exp;
        this.ptc   = ptc;
    }
}

class Enemy extends Character {
    constructor(name, maxHealth, strength, speed, attackRengec, attackRenged) {
        super(name, maxHealth, strength, speed, 0, 0, false, attackRengec, attackRenged, 1, 1, false);
    }
}

class Boss extends Enemy {
    constructor(name, maxHealth, strength, speed) {
        super(name, maxHealth, strength, speed, 1, 5);
        this.isBoss = true;
    }
}

var player = new Player();
var enemy1 = new Enemy("Vif-Lame",        100, 10, 20, 1, 0);
var enemy2 = new Enemy("Arc Calme",       100, 15, 10, 0, 5);
var enemy3 = new Enemy("Colosse Stable",  250, 15,  5, 1, 0);
var boss1  = new Boss ("Titan Imperçable",500, 30,  5);
var boss2  = new Boss ("Maître des Ombres",300, 50, 20);

export { player, enemy1, enemy2, enemy3, boss1, boss2 };
