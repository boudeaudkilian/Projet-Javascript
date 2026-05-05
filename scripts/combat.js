// ===== SYSTÈME DE COMBAT - Stickman RPG =====
import {
    playerElement,
    enemyElement,
    updatePosition,
    updateHealthBar,
    logToConsole,
    flashDamage,
    knockback,
    playerHealthBar,
    enemyHealthBar,
    playerHPText,
    enemyHPText
} from './visuel.js';
import { player } from './character.js';

// Vérifie si une attaque corps à corps peut toucher
const peutToucher = (attaquant, cible) => {
    let distance = Math.abs(cible.positionx - attaquant.positionx);
    
    if (distance <= attaquant.attackRengec) {
        return true;
    } else {
        return false;
    }
}

// Applique les dégâts à la cible (avec gestion de la défense)
const recevoirDegats = (cible, degats) => {
    // Si la cible se défend, réduit les dégâts de 50%
    if (cible.isDefending) {
        degats = degats * 0.5;
        const msg = cible.name + " bloque une partie des dégâts ! 🛡️";
        console.log(msg);
        logToConsole(msg);
    }
    
    cible.currentHealth -= degats;
    const msgDegats = cible.name + " perd " + degats + " PV";
    console.log(msgDegats);
    logToConsole(msgDegats);
    
    // Détermine quel élément et quelle barre de vie utiliser
    let element, healthBar, hpText;
    
    if (cible === player) {
        element = playerElement;
        healthBar = playerHealthBar;
        hpText = playerHPText;
    } else {
        element = enemyElement;
        healthBar = enemyHealthBar;
        hpText = enemyHPText;
    }
    
    // Effets visuels
    flashDamage(element);
    updateHealthBar(cible, healthBar, hpText);
    
    if (cible.currentHealth <= 0) {
        cible.currentHealth = 0;
        const msgKO = cible.name + " est K.O. !";
        console.log(msgKO);
        logToConsole(msgKO);
        updateHealthBar(cible, healthBar, hpText);
    }
}

// Attaque corps à corps
const attaquer = (attaquant, cible) => {
    const msg = attaquant.name + " attaque " + cible.name + " !";
    console.log(msg);
    logToConsole(msg);
    
    if (peutToucher(attaquant, cible)) {
        const msgTouche = "L'attaque touche !";
        console.log(msgTouche);
        logToConsole(msgTouche);
        
        // Effet de knockback visuel
        const direction = attaquant.positionx < cible.positionx ? "droite" : "gauche";
        const targetElement = cible === player ? playerElement : enemyElement;
        knockback(cible, targetElement, direction);
        
        recevoirDegats(cible, attaquant.strength);
    } else {
        const msgRate = "L'attaque rate ! Trop loin.";
        console.log(msgRate);
        logToConsole(msgRate);
    }
}

// Déplace un personnage
const deplacer = (personnage, direction) => {
    if (direction === "droite") {
        personnage.positionx += personnage.speed;
    } else if (direction === "gauche") {
        personnage.positionx -= personnage.speed;
    }
    
    // Détermine quel élément visuel mettre à jour
    const element = personnage === player ? playerElement : enemyElement;
    
    // Mise à jour visuelle
    updatePosition(personnage, element);
    
    const message = personnage.name + " se déplace vers la " + direction + " → position : " + personnage.positionx;
    console.log(message);
    logToConsole(message);
}

// Crée un projectile
const tirerProjectile = (attaquant) => {
    let projectile = {
        positionx: attaquant.positionx,
        positiony: attaquant.positiony,
        vitesse: 10,
        direction: attaquant.facingR ? "droite" : "gauche",
        degats: attaquant.strength,
        taille: 5,
        tireur: attaquant
    };
    
    const msg = attaquant.name + " tire un projectile !";
    console.log(msg);
    logToConsole(msg);
    return projectile;
}

// Déplace un projectile
const deplacerProjectile = (projectile) => {
    if (projectile.direction === "droite") {
        projectile.positionx += projectile.vitesse;
    } else if (projectile.direction === "gauche") {
        projectile.positionx -= projectile.vitesse;
    }
}

// Vérifie si un projectile touche une cible
const projectileTouche = (projectile, cible) => {
    let distance = Math.abs(cible.positionx - projectile.positionx);
    
    if (distance <= projectile.taille) {
        return true;
    } else {
        return false;
    }
}

// Attaque à distance avec projectile
const attaquerDistance = (attaquant, cible) => {
    // Vérifie si l'attaquant peut tirer
    if (!attaquant.canshoot) {
        const msg = attaquant.name + " ne peut pas tirer à distance !";
        console.log(msg);
        logToConsole(msg);
        return;
    }
    
    // Crée le projectile
    let projectile = tirerProjectile(attaquant);
    
    // Simule le déplacement du projectile
    let maxDistance = 300;
    let deplacementTotal = 0;
    
    while (deplacementTotal < maxDistance) {
        deplacerProjectile(projectile);
        deplacementTotal += projectile.vitesse;
        
        // Vérifie si le projectile touche la cible
        if (projectileTouche(projectile, cible)) {
            const msg = "💥 Le projectile touche " + cible.name + " !";
            console.log(msg);
            logToConsole(msg);
            recevoirDegats(cible, projectile.degats);
            return;
        }
    }
    
    const msg = "Le projectile n'a touché personne...";
    console.log(msg);
    logToConsole(msg);
}

// Active la défense
const activerDefense = (personnage) => {
    personnage.isDefending = true;
    const msg = personnage.name + " se met en position de défense ! 🛡️";
    console.log(msg);
    logToConsole(msg);
}

// Désactive la défense
const desactiverDefense = (personnage) => {
    personnage.isDefending = false;
    const msg = personnage.name + " arrête de se défendre.";
    console.log(msg);
    logToConsole(msg);
}

// Export de toutes les fonctions
export { 
    peutToucher, 
    recevoirDegats, 
    attaquer, 
    deplacer,
    tirerProjectile,
    deplacerProjectile,
    projectileTouche,
    attaquerDistance,
    activerDefense,
    desactiverDefense
};