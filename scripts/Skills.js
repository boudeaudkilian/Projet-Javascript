import { player } from "scripts/Character.js";

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
        const s = skills[key];
        if (s.unlocked || s.available) continue;
        if (Array.isArray(s.unlockedBy)) {
            s.available = s.unlockedBy.some(dep => skills[dep]?.unlocked);
        }
    }
}

function unlockSkill(skillName) {
    const s = skills[skillName];
    if (!s)            return false;
    if (s.unlocked)    return false;
    if (!s.available)  return false;
    if (player.ptc < s.cost) return false;

    player.ptc    -= s.cost;
    s.unlocked     = true;
    Effect(skillName);
    refreshAvailability();
    return true;
}

function Effect(skillName) {
    switch (true) {
        case skillName.startsWith("speed"):
            player.speed         += 2;  break;
        case skillName.startsWith("strength"):
            player.strength      += 5;  break;
        case skillName.startsWith("life"):
            player.maxHealth     += 50;
            player.currentHealth += 50; break;
        case skillName === "epee":
            player.strength      += 10;  break;
        case skillName === "arc":
            player.canshoot       = true;
            player.strength      += 5;  break;
    }
}

export { skills, gainExp, unlockSkill };
