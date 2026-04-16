let currentMatches = [];
let spinIntervals = []; // Tömb a három slot interval-jának
const abc = "abcdefghijklmnopqrstuvwxyz";

// Ékezetmentesítő
const normalizeText = (text) => {
    return text.toLowerCase()
        .replace(/á/g, 'a')
        .replace(/é/g, 'e')
        .replace(/[í]/g, 'i')
        .replace(/[óöő]/g, 'o')
        .replace(/[úüű]/g, 'u');
};

// Kereső motor
function findMatches(target) {
    const l = normalizeText(target);
    const l1 = l[0], l2 = l[1], l3 = l[2];

    currentMatches = magyarSzavak.filter(word => {
        const simpleWord = normalizeText(word);
        const firstIdx = simpleWord.indexOf(l1);
        if (firstIdx === -1) return false;
        const secondIdx = simpleWord.indexOf(l2, firstIdx + 1);
        if (secondIdx === -1) return false;
        const thirdIdx = simpleWord.indexOf(l3, secondIdx + 1);
        return thirdIdx !== -1;
    });

    return currentMatches;
}

// Felület frissítése a találatok után
function updateUI(letters) {
    const lettersArray = letters.toUpperCase().split('');
    
    // Frissítjük a slotokat a végleges betűkkel
    for (let i = 0; i < 3; i++) {
        const slot = document.getElementById(`slot${i+1}`);
        slot.innerHTML = `<div class="letter">${lettersArray[i]}</div>`;
    }

    const stats = document.getElementById('stats');
    stats.innerText = `${currentMatches.length} találat van.`;
    
    document.getElementById('show-results-btn').disabled = (currentMatches.length === 0);
    const list = document.getElementById('results-list');
    list.classList.add('hidden');
    list.innerHTML = '';
}

// Manuális keresés
function handleManual() {
    const val = document.getElementById('manual-input').value.trim();
    if (val.length !== 3) {
        alert("Kérlek 3 betűt írj be!");
        return;
    }
    findMatches(val);
    updateUI(val);
}

// Slot Machine pörgetés
function startSpin() {
    // Ha már pörög, ne csináljunk semmit
    if (document.getElementById('letters-box').classList.contains('spinning')) return;

    const lettersBox = document.getElementById('letters-box');
    const spinBtn = document.getElementById('spin-btn');
    
    lettersBox.classList.add('spinning');
    spinBtn.disabled = true;

    // Vizualitás: random betűk pörgetése mindhárom slotban
    spinIntervals = [];
    for (let i = 0; i < 3; i++) {
        const slot = document.getElementById(`slot${i+1}`);
        spinIntervals[i] = setInterval(() => {
            const randomLetter = abc[Math.floor(Math.random() * abc.length)];
            // Két betűt rakunk be, hogy a gördülés folyamatosnak tűnjön
            slot.innerHTML = `
                <div class="letter">${randomLetter.toUpperCase()}</div>
                <div class="letter">${abc[Math.floor(Math.random() * abc.length)].toUpperCase()}</div>
            `;
        }, 50); // Gyors betűváltás
    }

    // Háttérben megkeressük a tuti nyerőt
    let finalLetters = "";
    let foundValid = false;

    while (!foundValid) {
        finalLetters = "";
        for (let i = 0; i < 3; i++) {
            finalLetters += abc[Math.floor(Math.random() * abc.length)];
        }
        if (findMatches(finalLetters).length > 0) {
            foundValid = true;
        }
    }

    // Megállítjuk a pörgetést RÖVIDEBB IDŐ (kb 0.8 mp) után
    setTimeout(() => {
        // Megállítjuk a vizuális pörgetést
        spinIntervals.forEach(interval => clearInterval(interval));
        spinIntervals = [];
        
        lettersBox.classList.remove('spinning');
        spinBtn.disabled = false;
        
        // Frissítjük a GUI-t a végleges betűkkel és találatokkal
        updateUI(finalLetters);
    }, 800); // 800ms = 0.8 másodperc
}

// Eredmények megjelenítése ABC sorrendben
function showResults() {
    const list = document.getElementById('results-list');
    const sortedWords = [...currentMatches].sort((a, b) => a.localeCompare(b, 'hu'));
    const displayWords = sortedWords.slice(0, 150);
    list.innerHTML = displayWords.map(w => `<li>${w}</li>`).join('');
    list.classList.remove('hidden');
}

// Eseménykezelők
document.getElementById('spin-btn').addEventListener('click', startSpin);
document.getElementById('show-results-btn').addEventListener('click', showResults);
document.getElementById('manual-btn').addEventListener('click', handleManual);

document.getElementById('manual-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleManual();
});

console.log("Program kész. Szavak száma: " + magyarSzavak.length);