class Character {
    constructor(name, maxHealth, currentHealth, strength, speed, positionx, positiony, statusEffects, facingR, attackRengec = 1, attackRenged = 5, attackcoldownc = 1, attackcoldownd = 1, canshoot = false) {
        this.name     = name;
        this.maxHealth   = maxHealth;
        this.currentHealth = currentHealth;
        this.strength = strength;
        this.speed = speed;
        this.positionx = positionx;
        this.positiony = positiony;
        this.statusEffects = statusEffects;
        this.facingR = facingR;
        this.attackRengec = attackRengec;
        this.attackRenged = attackRenged;
        this.attackcoldownc = attackcoldownc;
        this.attackcoldownd = attackcoldownd;
        this.canshoot = canshoot;
    }
}

class Player extends Character {
    constructor() {
        //var shoot = false;
        //if (compshoot == true) {
        //    shoot = true;
        //}
        super("Sticky", 100, 100, 5, 5, 0, 0, [], true, 1, 0, 1, 0, false);
    }
}

class Enemy extends Character {
    constructor(name, maxHealth, currentHealth, strength, speed) {
        super(name, maxHealth, currentHealth, strength, speed, 0, 0, [], false, 1, 1, 1, 1, false);
    }
}

class Boss extends Enemy {
    constructor(name, maxHealth, currentHealth, strength, speed) {
        super(name, maxHealth, currentHealth, strength, speed, 0, 0, [], false, 1, 5, 1, 5, false);
        this.isBoss = true;
    }
}

var player = new Player();
var enemy1 = new Enemy("Vif-Lame",  100,  100,  10,  20, 0, 0, [], false, 1, 0, 1, 0, false);
var enemy2 = new Enemy("Arc Calme",     100,  100,  15,  10, 0, 0, [], false, 0, 5, 0, 5, false);
var enemy3 = new Enemy("Colosse Stable",   250,  250,  15,  5, 0, 0, [], false, 1, 0, 1, 0, false);
var boss1 = new Boss("Titan Imperçable",  500,  500, 50,  5, 0, 0, [], false, 1, 5, 1, 5, false);
var boss2 = new Boss("Maître des Ombres",  300,  300,  50,  20, 0, 0, [], false, 1, 5, 1, 5, false);
export { player, enemy1, enemy2, enemy3, boss1, boss2 };
