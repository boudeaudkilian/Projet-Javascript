class Character {
    constructor(name, maxHealth, currentHealth, strength, speed) {
        this.name     = name;
        this.maxHealth   = maxHealth;
        this.currentHealth = currentHealth;
        this.strength = strength;
        this.speed = speed;
    }
}

class Player extends Character {
    constructor() {
        super("Sticky", 100, 100, 5, 5);
    }
}

class Enemy extends Character {
    constructor(name, maxHealth, currentHealth, strength, speed) {
        super(name, maxHealth, currentHealth, strength, speed);
    }
}

class Boss extends Enemy {
    constructor(name, maxHealth, currentHealth, strength, speed) {
        super(name, maxHealth, currentHealth, strength, speed);
        this.isBoss = true;
    }
}

var player = new Player();
var enemy1 = new Enemy("Goblin",  100,  100,  10,  20);
var enemy2 = new Enemy("Orc",     100,  100,  15,  10);
var enemy3 = new Enemy("Troll",   250,  250,  15,  5);
var boss1 = new Boss("Demon",  500,  500,  50,  5);
var boss2   = new Boss ("Boss",    300,  300,  50,  20);

export { player, enemy1, enemy2, enemy3, boss1, boss2 };
