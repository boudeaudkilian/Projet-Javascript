import { player } from "./Character.js";
import { skills, unlockSkill } from "./Skills.js";

// Restaure la progression sauvegardée
try {
    const saved = JSON.parse(localStorage.getItem('playerProgress') || 'null');
    if (saved) {
        player.exp = saved.exp ?? 0;
        player.level = saved.level ?? 1;
        player.ptc = saved.ptc ?? 1;
        player.maxHealth = saved.maxHealth ?? player.maxHealth;
        player.currentHealth = player.maxHealth;
        player.strength = saved.strength ?? player.strength;
        player.speed = saved.speed ?? player.speed;
        player.canShoot = saved.canShoot ?? player.canShoot;
    }
} catch (e) { /* ignore */ }

const persist = () => {
    try {
        localStorage.setItem('playerProgress', JSON.stringify({
            exp: player.exp, level: player.level, ptc: player.ptc,
            maxHealth: player.maxHealth, strength: player.strength,
            speed: player.speed, canShoot: player.canShoot,
        }));
    } catch (e) {}
};

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
        const s     = skills[key];
        const card  = document.querySelector(".card-" + key);
        const cost  = document.querySelector(".cost-" + key);

        if (!card || !cost) continue;

        card.classList.remove("unlocked", "locked");
        if (s.unlocked) {
            card.classList.add("unlocked");
            if (cost) cost.innerHTML = '<span class="badge-done">Débloquée</span>';
        } else if (!s.available) {
            card.classList.add("locked");
        } else if (cost) {
            cost.textContent = "Coût : 1 pt";
        }
    }
}

window.tryUnlock = function(skillName) {
    const s = skills[skillName];
    if (!s) return;
    if (s.unlocked)        { showMsg(`${s.name} est déjà débloquée.`);             return; }
    if (!s.available)      { showMsg(`${s.name} n'est pas encore disponible.`);    return; }
    if (player.ptc < s.cost) { showMsg(`Pas assez de points. (${player.ptc}/${s.cost})`); return; }

    unlockSkill(skillName);
    persist();
    refreshUI();
    showMsg(`${s.name} débloquée !`);
};

window.resetTree = function() {
    for (const key in skills) {
        if (skills[key].unlocked) {
            player.ptc += 1;
            if (key === "epee")                    player.strength      -= 10;
            if (key === "arc")                   { player.canShoot       = false;
                                                   player.strength      -= 5; }
            if (key.startsWith("speed"))           player.speed         -= 2;
            if (key.startsWith("strength"))        player.strength      -= 5;
            if (key.startsWith("life"))          { player.maxHealth     -= 50;
                                                   player.currentHealth -= 50; }
        }
        skills[key].unlocked  = false;
        skills[key].available = skills[key].unlockedBy === null;
    }
    persist();
    refreshUI();
    showMsg("Arbre réinitialisé.");
};

refreshUI();
