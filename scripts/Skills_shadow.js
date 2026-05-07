import { player } from "scripts/Character.js";
import { skills, unlockSkill } from "scripts/Skills.js";

function showMsg(text) {
    const el = document.getElementById("msg");
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
        const s     = skills[key];
        const card  = document.querySelector(".card-" + key);
        const cost  = document.querySelector(".cost-" + key);

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

    if (s.unlocked)        { showMsg(`${s.name} est déjà débloquée.`);          return; }
    if (!s.available)      { showMsg(`${s.name} n'est pas encore disponible.`);  return; }
    if (player.ptc < s.cost) { showMsg(`Pas assez de points. (${player.ptc}/${s.cost})`); return; }

    unlockSkill(skillName);
    refreshUI();
    showMsg(`${s.name} débloquée !`);
};

window.resetTree = function() {
    for (const key in skills) {
        if (skills[key].unlocked) {
            player.ptc += 1;
            if (key === "epee")                    player.strength      -= 10;
            if (key === "arc")                   { player.canshoot       = false;
                                                   player.strength      -= 5; }
            if (key.startsWith("speed"))           player.speed         -= 2;
            if (key.startsWith("strength"))        player.strength      -= 5;
            if (key.startsWith("life"))          { player.maxHealth     -= 50;
                                                   player.currentHealth -= 50; }
        }
        skills[key].unlocked  = false;
        skills[key].available = skills[key].unlockedBy === null;
    }

    refreshUI();
    showMsg("Arbre réinitialisé.");
};

refreshUI();