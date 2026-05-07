// GESTION DES ÉCRANS

const screens = {
    home: document.getElementById('homeScreen'),
    mainMenu: document.getElementById('mainMenu'),
    instructions: document.getElementById('instructionsScreen')
};

// Affichage d'un écran spécifique
function showScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.remove('active'));
    if (screens[screenName]) {
        screens[screenName].classList.add('active');
    }
}

// GESTION DES BOUTONS

document.getElementById('startBtn').addEventListener('click', () => {
    showScreen('mainMenu');
});

document.getElementById('instructionsBtn').addEventListener('click', () => {
    showScreen('instructions');
});

document.getElementById('newGameBtn').addEventListener('click', () => {
    // TODO: Démarrer une nouvelle partie
});

document.getElementById('resumeBtn').addEventListener('click', () => {
    // TODO: Reprendre la partie
});

document.getElementById('skillsBtn').addEventListener('click', () => {
    // TODO: Afficher les compétences
});

document.getElementById('backToHomeBtn').addEventListener('click', () => {
    showScreen('home');
});

document.getElementById('backFromInstructionsBtn').addEventListener('click', () => {
    showScreen('home');
});


// INITIALISATION AU CHARGEMENT

window.addEventListener('load', () => {
    showScreen('home');
});
