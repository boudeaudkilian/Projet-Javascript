import { player } from "./Character";

class deplock {
    constructor(name, description, effect, cost, up, deplock) {
        this.name = name;
        this.description = description;
        this.effect = effect;
        this.cost = cost;
        this.deplock = deplock;
        this.up = up;
    }
}

var epee = new deplock("Epee", "Vous obtenez une épée tranchante", "Permet d'infliger plus de dégâts qu'à main nue", 1, true, false);
var arc = new deplock("Arc", "Vous obtenez un arc à longue portée", "Permet d'attaquer à distance", 1, true, false);
var speed = new deplock("Speed+", "Vous obtenez un boost pour aller plus vite", "Augmente la vitesse de déplacement", 1, false, false);
var strength = new deplock("Strength+", "Vous obtenez un boost pour être plus fort", "Augmente la force", 1, false, false);
var life = new deplock("Life+", "Vous obtenez un boost pour être plus résistant", "Augmente la santé maximale", 1, false, false);


const ptc = 0;

function Exp(Exp) {
    if (Exp > 100) {
        ptc = ptc + 1;
        return ptc;
    }
}

function Competence(ptc) {
    if (epee.up == true) {
        if (ptc >= epee.cost) {
            ptc = ptc - epee.cost;
            epee.up = false;
            epee.deplock = true;
            if (speed.up == false) {
                speed.up = true;
            }
            if (strength.up == false) {
                strength.up = true;
            }
            if (life.up == false) {
                life.up = true;
            }
        } else {
            console.log("Vous n'avez pas assez de points de compétence pour débloquer cette compétence.");
        }
    }
    if (arc.up == true) {
        if (ptc >= arc.cost) {
            ptc = ptc - arc.cost;
            arc.up = false;
            arc.deplock = true;
            if (speed.up == false) {
                speed.up = true;
            }
            if (strength.up == false) {
                strength.up = true;
            }
            if (life.up == false) {
                life.up = true;
            }
        } else {
            console.log("Vous n'avez pas assez de points de compétence pour débloquer cette compétence.");
        }
    }
    if (speed.up == true) {
        if (ptc >= speed.cost) {
            ptc = ptc - speed.cost;
            speed.deplock = true;
        } else {
            console.log("Vous n'avez pas assez de points de compétence pour débloquer cette compétence.");
        }
    }
    if (strength.up == true) {
        if (ptc >= strength.cost) {
            ptc = ptc - strength.cost;
            strength.deplock = true;
        } else {
            console.log("Vous n'avez pas assez de points de compétence pour débloquer cette compétence.");
        }
    }
}

function buff() {
    if (epee.deplock == true) {
        player.strength = player.strength + 5
    }
    if (arc.deplock == true) {
        player.canshoot = true;
    }
    if (speed.deplock == true) {
        player.speed = player.speed + 1;
        speed.deplock = false;
    }
    if (strength.deplock == true) {
        player.strength = player.strength + 1;
        strength.deplock = false;
    }
    if (life.deplock == true) {
        player.maxHealth = player.maxHealth + 10;
        life.deplock = false;
    }
}