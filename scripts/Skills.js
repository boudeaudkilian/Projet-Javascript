// ===== SYSTÈME D'EXPÉRIENCE & ARBRE DE COMPÉTENCES =====
//
// CONCEPT RPG :
// - Le joueur tue des ennemis  → il gagne de l'XP (gainExp)
// - Quand l'XP atteint un seuil → il monte d'un niveau (level up)
// - Chaque level up donne 1 point de compétence (ptc)
// - Les points sont dépensés dans l'arbre (unlockSkill)
// - Chaque compétence applique un bonus permanent (applyEffect)
// - Tout est sauvegardé dans le localStorage par arene.js / Skills_shadow.js
//
// COURBE D'XP "classique RPG croissante" :
//   XP nécessaire pour passer du niveau N au niveau N+1 = N * 100
//   → Niv 1→2 : 100 XP, Niv 2→3 : 200 XP, Niv 3→4 : 300 XP, etc.
//
import { player } from './Character.js';

class Skill {
    constructor(name, description, cost, unlockedBy) {
        this.name        = name;
        this.description = description;
        this.cost        = cost;
        this.unlocked    = false;
        this.unlockedBy  = unlockedBy;
        this.available   = unlockedBy === null;
    }
}

const skills = {
    epee:      new Skill("Épée",      "Inflige plus de dégâts au corps à corps", 1, null),
    arc:       new Skill("Arc",       "Permet d'attaquer à distance",             1, null),
    speed1:    new Skill("Speed+",    "Augmente la vitesse de déplacement",       1, ["epee", "arc"]),
    strength1: new Skill("Strength+", "Augmente la force d'attaque",              1, ["epee", "arc"]),
    life1:     new Skill("Life+",     "Augmente la santé maximale",               1, ["epee", "arc"]),
    speed2:    new Skill("Speed+",    "Augmente la vitesse de déplacement",       1, ["speed1"]),
    strength2: new Skill("Strength+", "Augmente la force d'attaque",              1, ["strength1"]),
    life2:     new Skill("Life+",     "Augmente la santé maximale",               1, ["life1"]),
    speed3:    new Skill("Speed+",    "Augmente la vitesse de déplacement",       1, ["speed2"]),
    strength3: new Skill("Strength+", "Augmente la force d'attaque",              1, ["strength2"]),
    life3:     new Skill("Life+",     "Augmente la santé maximale",               1, ["life2"]),
};

// --------- COURBE D'XP ---------
// Renvoie l'XP totale requise pour PASSER d'un niveau à l'autre.
// Ex. xpForNextLevel(1) = 100  → il faut 100 XP pour passer de niv 1 à niv 2.
function xpForNextLevel(level) {
    return level * 100;
}

// --------- GAIN D'XP & LEVEL UP ---------
// On boucle tant qu'il reste assez d'XP pour monter (cas où on tue un boss
// qui donne beaucoup d'XP et fait monter de plusieurs niveaux d'un coup).
// On déclenche un évènement DOM 'levelUp' pour que l'UI puisse réagir
// (animation, son, message...) — c'est la séparation logique / affichage.
function gainExp(amount) {
    if (amount <= 0) return;
    player.exp += amount;

    let leveledUp = false;
    let levelsGained = 0;

    while (player.exp >= xpForNextLevel(player.level)) {
        player.exp   -= xpForNextLevel(player.level);
        player.level += 1;
        player.ptc   += 1;
        // Petit bonus de level up : on rend un peu de PV au joueur
        player.maxHealth     += 5;
        player.currentHealth  = player.maxHealth;
        leveledUp     = true;
        levelsGained += 1;
    }

    if (leveledUp) {
        window.dispatchEvent(new CustomEvent('levelUp', {
            detail: { newLevel: player.level, levelsGained, points: player.ptc }
        }));
    }
}

function refreshAvailability() {
    for (const key in skills) {
        const s = skills[key];
        if (s.unlocked || s.available) continue;
        if (Array.isArray(s.unlockedBy)) {
            s.available = s.unlockedBy.some(dep => skills[dep]?.unlocked);
        }
    }
}

function applyEffect(skillName) {
    switch (true) {
        case skillName.startsWith("speed"):
            player.speed         += 2;  break;
        case skillName.startsWith("strength"):
            player.strength      += 5;  break;
        case skillName.startsWith("life"):
            player.maxHealth     += 50;
            player.currentHealth += 50; break;
        case skillName === "epee":
            player.strength      += 10; break;
        case skillName === "arc":
            player.canShoot       = true;
            player.strength      += 5;  break;
    }
}

function unlockSkill(skillName) {
    const s = skills[skillName];
    if (!s)               return false;
    if (s.unlocked)       return false;
    if (!s.available)     return false;
    if (player.ptc < s.cost) return false;

    player.ptc    -= s.cost;
    s.unlocked     = true;
    applyEffect(skillName);
    refreshAvailability();
    return true;
}

export { skills, gainExp, unlockSkill, applyEffect, refreshAvailability, xpForNextLevel };
