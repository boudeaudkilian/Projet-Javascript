class deplock {
    constructor(name, description, effect, cost, deplock, up) {
        this.name = name;
        this.description = description;
        this.effect = effect;
        this.cost = cost;
        this.deplock = deplock;
        this.up = up;
    }
}

var epee = new deplock("Epee", "Vous obtenez une épée tranchante", "Permet d'infliger plus de dégâts qu'à main nue", 1, false, false);
var arc = new deplock("Arc", "Vous obtenez un arc à longue portée", "Permet d'attaquer à distance", 1, false, false);
var jump = new deplock("Jump", "Vous obtenez la capacité de sauter", "Permet de sauter", 1, false, false);
var speed = new deplock("Speed+", "Vous obtenez un boost pour aller plus vite", "Augmente la vitesse de déplacement", 1, false, false);
var strength = new deplock("Strength+", "Vous obtenez un boost pour être plus fort", "Augmente la force", 1, false, false);

const ptc = 0;

function Exp(Exp) {
    if (Exp > 100) {
        ptc = ptc + 1;
        return ptc;
    }
}

function Competence(ptc) {
    if (up.epee == true) {
        if (ptc >= epee.cost) {
            ptc = ptc - epee.cost;
            epee.deplock = true;
        } else {
            console.log("Vous n'avez pas assez de points de compétence pour débloquer cette compétence.");
        }
    }
    if (up.arc == true) {
        if (ptc >= arc.cost) {
            ptc = ptc - arc.cost;
            arc.deplock = true;
        } else {
            console.log("Vous n'avez pas assez de points de compétence pour débloquer cette compétence.");
        }
    }
    if (up.jump == true) {
        if (ptc >= jump.cost) {
            ptc = ptc - jump.cost;
            jump.deplock = true;
        } else {
            console.log("Vous n'avez pas assez de points de compétence pour débloquer cette compétence.");
        }
    }
    if (up.speed == true) {
        if (ptc >= speed.cost) {
            ptc = ptc - speed.cost;
            speed.deplock = true;
        } else {
            console.log("Vous n'avez pas assez de points de compétence pour débloquer cette compétence.");
        }
    }
    if (up.strength == true) {
        if (ptc >= strength.cost) {
            ptc = ptc - strength.cost;
            strength.deplock = true;
        } else {
            console.log("Vous n'avez pas assez de points de compétence pour débloquer cette compétence.");
        }
    }
}