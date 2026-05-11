import { player, allEnemies, getLevel, getLevelSequence, LEVELS } from './Character.js';
import {
    attaquer, deplacer, attaquerDistance,
    activerDefense, desactiverDefense,
    setEnemy, updateProjectiles, combatState,
    resetCombat,
} from './combat.js';
import { updateEnemyAI } from './ia.js';
import {
    playerElement, enemyElement,
    playerHealthBar, enemyHealthBar,
    playerHPText, enemyHPText,
    updatePosition, updateHealthBar, setNames,
    applyEnemyVisual,
    logToConsole, getArenaBounds, showEndScreen, hideEndScreen,
    showBanner,
    updateXPBar, showXPGain, showLevelUpToast,
} from './visuel.js';
import { gainExp } from './Skills.js';

// Écoute l'évènement émis par gainExp() — séparation logique/UI
window.addEventListener('levelUp', (e) => {
    showLevelUpToast(e.detail.newLevel);
    logToConsole(`⭐ LEVEL UP ! Niveau ${e.detail.newLevel} (+${e.detail.levelsGained} niveau(x))`);
    updateXPBar(player);
    updateHealthBar(player, playerHealthBar, playerHPText);
});

try {
    const saved = JSON.parse(localStorage.getItem('playerProgress') || 'null');
    if (saved) {
        player.exp           = saved.exp           ?? 0;
        player.level         = saved.level         ?? 1;
        player.ptc           = saved.ptc           ?? 1;
        player.maxHealth     = saved.maxHealth     ?? player.maxHealth;
        player.currentHealth = player.maxHealth;
        player.strength      = saved.strength      ?? player.strength;
        player.speed         = saved.speed         ?? player.speed;
        player.canShoot      = saved.canShoot      ?? player.canShoot;
    }
} catch (e) {}

const MODE_CAMPAIGN = 'campaign';
const MODE_FREE     = 'free';

const session = {
    mode:          localStorage.getItem('gameMode') || MODE_CAMPAIGN,
    levelId:       parseInt(localStorage.getItem('selectedLevel') || '1', 10),
    fightIndex:    0,
    sequence:      [],
    currentEnemy:  null,
};

const buildSequence = () => {
    session.sequence = session.mode === MODE_CAMPAIGN
        ? getLevelSequence(session.levelId)
        : allEnemies;
};

const setupCombat = (enemy) => {
    resetCombat();

    session.currentEnemy = enemy;

    player.reset();
    enemy.reset();
    setEnemy(enemy);

    const { max } = getArenaBounds();
    player.positionx = 100;
    enemy.positionx  = Math.max(300, max - 150);
    player.facingR   = true;
    enemy.facingR    = false;

    setNames(player, enemy);
    applyEnemyVisual(enemy);
    updatePosition(player, playerElement);
    updatePosition(enemy, enemyElement);
    updateHealthBar(player, playerHealthBar, playerHPText);
    updateHealthBar(enemy, enemyHealthBar, enemyHPText);

    hideEndScreen();

    let banner = '';
    if (session.mode === MODE_CAMPAIGN) {
        const lvl = getLevel(session.levelId);
        banner = `${lvl.name} — Combat ${session.fightIndex + 1}/${session.sequence.length}`;
        if (enemy.kind === 'ultra')      banner = `⚠️ ULTRA BOSS ⚠️ ${enemy.name}`;
        else if (enemy.kind === 'boss')  banner = `★ BOSS ★ ${enemy.name}`;
    } else {
        banner = `Combat libre : ${enemy.name}`;
    }
    showBanner(banner);
    logToConsole(`Combat lancé : ${player.name} vs ${enemy.name}`);
};

const startCurrentLevel = () => {
    buildSequence();
    session.fightIndex = 0;
    setupCombat(session.sequence[0]);
};

const nextFightInSequence = () => {
    session.fightIndex += 1;
    if (session.fightIndex >= session.sequence.length) return null;
    return session.sequence[session.fightIndex];
};

const pickEnemyFree = () => {
    const stored = localStorage.getItem('selectedEnemy');
    return allEnemies.find(e => e.name === stored) || allEnemies[0];
};

if (session.mode === MODE_CAMPAIGN) {
    startCurrentLevel();
} else {
    buildSequence();
    setupCombat(pickEnemyFree());
}

window.testDeplacer       = (dir) => deplacer(player, dir);
window.testAttaquer       = ()    => attaquer(player, session.currentEnemy);
window.testAttaqueDistance= ()    => attaquerDistance(player, session.currentEnemy);
window.testDefense        = ()    => {
    if (player.isDefending) desactiverDefense(player);
    else activerDefense(player);
};

const keysHeld = new Set();

window.addEventListener('keydown', (e) => {
    if (combatState.over) return;
    keysHeld.add(e.key);
    switch (e.key) {
        case ' ':
        case 'a': case 'A':
            attaquer(player, session.currentEnemy); break;
        case 'e': case 'E':
            attaquerDistance(player, session.currentEnemy); break;
        case 's': case 'S':
            activerDefense(player); break;
    }
});

window.addEventListener('keyup', (e) => {
    keysHeld.delete(e.key);
    if ((e.key === 's' || e.key === 'S') && player.isDefending) {
        desactiverDefense(player);
    }
});

let lastAITick  = 0;
const AI_TICK_MS = 100;

const gameLoop = (now) => {
    if (!combatState.over) {
        if (keysHeld.has('ArrowLeft')  || keysHeld.has('q') || keysHeld.has('Q')) deplacer(player, "gauche");
        if (keysHeld.has('ArrowRight') || keysHeld.has('d') || keysHeld.has('D')) deplacer(player, "droite");

        if (now - lastAITick > AI_TICK_MS) {
            updateEnemyAI();
            lastAITick = now;
        }
        updateProjectiles();
    }
    requestAnimationFrame(gameLoop);
};
requestAnimationFrame(gameLoop);

const persistPlayer = () => {
    try {
        localStorage.setItem('playerProgress', JSON.stringify({
            exp:      player.exp,
            level:    player.level,
            ptc:      player.ptc,
            maxHealth:player.maxHealth,
            strength: player.strength,
            speed:    player.speed,
            canShoot: player.canShoot,
        }));
        if (session.mode === MODE_CAMPAIGN) {
            localStorage.setItem('campaignProgress', JSON.stringify({
                levelId:    session.levelId,
                fightIndex: session.fightIndex,
            }));
        }
    } catch (e) {}
};

const xpFor = (enemy) => {
    let xp = 25 + Math.floor(enemy.maxHealth / 4);
    if (enemy.kind === 'boss')  xp = Math.floor(xp * 1.5);
    if (enemy.kind === 'ultra') xp *= 3;
    return xp;
};

const unlockNextLevelIfNeeded = () => {
    const unlocked = parseInt(localStorage.getItem('maxUnlockedLevel') || '1', 10);
    const next = Math.min(LEVELS.length, session.levelId + 1);
    if (next > unlocked) {
        localStorage.setItem('maxUnlockedLevel', String(next));
        return true;
    }
    return false;
};

window.addEventListener('combatEnd', (e) => {
    const { winner, loser, isPlayerWin } = e.detail;
    const enemy = session.currentEnemy;

    if (isPlayerWin) {
        const xp = xpFor(enemy);
        gainExp(xp);                 // logique : ajoute l'XP, déclenche level up
        showXPGain(xp);              // visuel : "+XP" qui flotte
        updateXPBar(player);         // visuel : remplit la barre d'XP du HUD
        logToConsole(`+${xp} XP ! Niveau ${player.level} (pts: ${player.ptc})`);
    }
    persistPlayer();

    const actions  = {};
    const lvl      = getLevel(session.levelId);
    const isLast   = session.fightIndex >= session.sequence.length - 1;

    if (session.mode === MODE_CAMPAIGN && isPlayerWin) {
        if (!isLast) {
            actions.onNext    = () => { const next = nextFightInSequence(); if (next) setupCombat(next); };
            actions.nextLabel = `➡️ Combat suivant (${session.fightIndex + 2}/${session.sequence.length})`;
        } else {
            const wasNew = unlockNextLevelIfNeeded();
            if (session.levelId < LEVELS.length) {
                actions.onNext = () => {
                    session.levelId += 1;
                    localStorage.setItem('selectedLevel', String(session.levelId));
                    startCurrentLevel();
                };
                actions.nextLabel = wasNew
                    ? `🔓 Niveau ${session.levelId + 1} débloqué — Y aller`
                    : `➡️ Niveau ${session.levelId + 1}`;
            } else {
                actions.victoryFinal = true;
            }
        }
    }

    actions.onReplay = () => setupCombat(enemy);
    actions.onLevels = () => { window.location.href = 'index.html#levels'; };
    actions.onHome   = () => { window.location.href = 'index.html'; };
    actions.onSkills = () => { window.location.href = 'Skills.html'; };

    showEndScreen({
        winnerName:   winner.name,
        isVictory:    isPlayerWin,
        levelName:    lvl.name,
        progressText: `${session.fightIndex + 1}/${session.sequence.length}`,
        xpGained:     isPlayerWin ? xpFor(enemy) : 0,
        playerLevel:  player.level,
        playerPts:    player.ptc,
    }, actions);
});

updateHealthBar(player, playerHealthBar, playerHPText);
updateXPBar(player); // initialise le HUD d'XP au chargement
