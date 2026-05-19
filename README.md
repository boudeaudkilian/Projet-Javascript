# Stickman RPG — Module Combat

Pour lancer le jeux tapez dans votre terminal la ligne suivante : node Server.js

##  Structure

```
PROJET-JAVASCRIPT/
├── index.html
├── styles/
│   └── main.css
└── scripts/
    ├── main.js        ← point d'entrée + boucle de jeu + clavier
    ├── character.js   ← classes Player / Enemy / Boss
    ├── combat.js      ← attaques, dégâts, projectiles, fin de combat
    ├── ia.js          ← IA ennemie basique
    └── visuel.js      ← DOM, barres de vie, animations
```

## 🎮 Contrôles

| Touche | Action |
|---|---|
| ← / Q | Aller à gauche |
| → / D | Aller à droite |
| Espace / A | Attaque corps à corps |
| E | Tir à distance |
| S (maintenir) | Défense (-50% dégâts) |

