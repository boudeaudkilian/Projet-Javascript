import { player } from "./Character.js";

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
    epee:     new Skill("Epee",      "Vous obtenez une épée tranchante",          1, null),
    arc:      new Skill("Arc",       "Vous obtenez un arc à longue portée",        1, null),
    speed:    new Skill("Speed+",    "Augmente la vitesse de déplacement",         1, ["epee", "arc"]),
    strength: new Skill("Strength+", "Augmente la force d'attaque",                1, ["epee", "arc"]),
    life:     new Skill("Life+",     "Augmente la santé maximale",                 1, ["epee", "arc"]),
};

function gainExp(amount) {
    player.exp += amount;
    if (player.exp >= 100) {
        player.exp   -= 100;
        player.level += 1;
        player.ptc   += 1;
    }
}

function refreshAvailability() {
    for (const key in skills) {
        const skill = skills[key];
        if (skill.unlocked || skill.available) continue;
        if (Array.isArray(skill.unlockedBy)) {
            skill.available = skill.unlockedBy.some(dep => skills[dep]?.unlocked);
        }
    }
}

function unlockSkill(skillName) {
    const skill = skills[skillName];
    if (!skill) {
        console.log("Compétence inconnue.");
        return false;
    }
    if (skill.unlocked) {
        console.log(`${skill.name} est déjà débloquée.`);
        return false;
    }
    if (!skill.available) {
        console.log(`${skill.name} n'est pas encore disponible.`);
        return false;
    }
    if (player.ptc < skill.cost) {
        console.log(`Pas assez de points. (${player.ptc}/${skill.cost})`);
        return false;
    }

    player.ptc    -= skill.cost;
    skill.unlocked = true;
    Effect(skillName);
    refreshAvailability();
    return true;
}

function Effect(skillName) {
    switch (skillName) {
        case "epee":     player.strength      += 5;  break;
        case "arc":
            player.canshoot      = true;
            player.strength      += 3;
            break;
        case "speed":    player.speed         += 1;  break;
        case "strength": player.strength      += 3;  break;
        case "life":
            player.maxHealth     += 20;
            player.currentHealth += 20;
            break;
    }
}

export { skills, gainExp, unlockSkill };
