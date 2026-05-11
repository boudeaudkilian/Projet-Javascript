import { player } from "./Character.js";
import { skills, unlockSkill, applyEffect, refreshAvailability } from "./Skills.js";

const SAVE_KEY = 'stickmanSave';

function saveGame() {
    const save = {
        player: {
            level:         player.level,
            exp:           player.exp,
            ptc:           player.ptc,
            strength:      player.strength,
            speed:         player.speed,
            maxHealth:     player.maxHealth,
            currentHealth: player.currentHealth,
            canShoot:      player.canShoot,
        },
        skills: {}
    };
    for (const key in skills) {
        save.skills[key] = {
            unlocked:  skills[key].unlocked,
            available: skills[key].available,
        };
    }
    localStorage.setItem(SAVE_KEY, JSON.stringify(save));
}

function loadGame() {
    try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (!raw) return;
        const save = JSON.parse(raw);

        player.level         = save.player.level         ?? 1;
        player.exp           = save.player.exp           ?? 0;
        player.ptc           = save.player.ptc           ?? 1;
        player.strength      = save.player.strength      ?? player.strength;
        player.speed         = save.player.speed         ?? player.speed;
        player.maxHealth     = save.player.maxHealth     ?? player.maxHealth;
        player.currentHealth = save.player.currentHealth ?? player.maxHealth;
        player.canShoot      = save.player.canShoot      ?? player.canShoot;

        for (const key in save.skills) {
            if (skills[key]) {
                skills[key].unlocked  = save.skills[key].unlocked;
                skills[key].available = save.skills[key].available;
            }
        }
    } catch (e) {
        localStorage.removeItem(SAVE_KEY);
    }
}

function showMsg(text) {
    const el = document.getElementById("msg");
    if (!el) return;
    el.textContent = text;
    clearTimeout(el._t);
    el._t = setTimeout(() => el.textContent = "", 2500);
}

function refreshUI() {
    document.getElementById("pts-display").textContent     = player.ptc;
    document.getElementById("player-name").textContent     = player.name;
    document.getElementById("player-life").textContent     = player.maxHealth;
    document.getElementById("player-strength").textContent = player.strength;
    document.getElementById("player-speed").textContent    = player.speed;

    for (const key in skills) {
        const s    = skills[key];
        const card = document.querySelector(".card-" + key);
        const cost = document.querySelector(".cost-" + key);

        if (!card || !cost) continue;

        card.classList.remove("unlocked", "locked");
        if (s.unlocked) {
            card.classList.add("unlocked");
            cost.innerHTML = '<span class="badge-done">Débloquée</span>';
        } else if (!s.available) {
            card.classList.add("locked");
        } else {
            cost.textContent = "Coût : 1 pt";
        }
    }
}

window.tryUnlock = function(skillName) {
    const s = skills[skillName];
    if (!s) return;
    if (s.unlocked)          { showMsg(`${s.name} est déjà débloquée.`);          return; }
    if (!s.available)        { showMsg(`${s.name} n'est pas encore disponible.`); return; }
    if (player.ptc < s.cost) { showMsg(`Pas assez de points. (${player.ptc}/${s.cost})`); return; }

    unlockSkill(skillName);
    saveGame();
    refreshUI();
    showMsg(`${s.name} débloquée !`);
};

window.resetTree = function() {
    for (const key in skills) {
        if (skills[key].unlocked) {
            player.ptc += 1;
            if (key === "epee")               player.strength      -= 10;
            if (key === "arc")              { player.canShoot       = false;
                                              player.strength      -= 5; }
            if (key.startsWith("speed"))      player.speed         -= 2;
            if (key.startsWith("strength"))   player.strength      -= 5;
            if (key.startsWith("life"))     { player.maxHealth     -= 50;
                                              player.currentHealth -= 50; }
        }
        skills[key].unlocked  = false;
        skills[key].available = skills[key].unlockedBy === null;
    }
    saveGame();
    refreshUI();
    showMsg("Arbre réinitialisé.");
};

loadGame();
refreshUI();
