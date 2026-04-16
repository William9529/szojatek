let currentMatches = [];

// Ékezetmentesítő függvény a szabályaid szerint (o -> ö, ő stb.)
const normalizeText = (text) => {
    return text.toLowerCase()
        .replace(/á/g, 'a')
        .replace(/é/g, 'e')
        .replace(/[í]/g, 'i')
        .replace(/[óöő]/g, 'o')
        .replace(/[úüű]/g, 'u');
};

function generateLetters() {
    // Gyakori angol abc betűk (q, x, w, y ritkább a magyarban, de benne hagytam)
    const abc = "abcdefghijklmnopqrstuvwxyz";
    let letters = "";
    for (let i = 0; i < 3; i++) {
        letters += abc[Math.floor(Math.random() * abc.length)];
    }
    
    // Megjelenítés
    document.getElementById('letters').innerText = letters.toUpperCase().split('').join(' ');
    
    // Keresés indítása
    findMatches(letters);
}

function findMatches(target) {
    const l1 = target[0];
    const l2 = target[1];
    const l3 = target[2];

    // Szűrés a magyarSzavak listán (ami a szavak.js-ben van)
    currentMatches = magyarSzavak.filter(word => {
        const simpleWord = normalizeText(word);
        
        const firstIdx = simpleWord.indexOf(l1);
        if (firstIdx === -1) return false;

        const secondIdx = simpleWord.indexOf(l2, firstIdx + 1);
        if (secondIdx === -1) return false;

        const thirdIdx = simpleWord.indexOf(l3, secondIdx + 1);
        return thirdIdx !== -1;
    });

    // Darabszám kiírása
    const stats = document.getElementById('stats');
    stats.innerText = `${currentMatches.length} találat van.`;
    
    // Gomb és lista alaphelyzetbe állítása
    document.getElementById('show-results-btn').disabled = (currentMatches.length === 0);
    const list = document.getElementById('results-list');
    list.classList.add('hidden');
    list.innerHTML = '';
}

function showResults() {
    const list = document.getElementById('results-list');
    
    // Csak az első 200 találatot írjuk ki a gyorsaság miatt
    const displayWords = currentMatches.slice(0, 200);
    
    list.innerHTML = displayWords.map(w => `<li>${w}</li>`).join('');
    list.classList.remove('hidden');
}

// Eseménykezelők
document.getElementById('generate-btn').addEventListener('click', generateLetters);
document.getElementById('show-results-btn').addEventListener('click', showResults);

console.log("A program készen áll, " + magyarSzavak.length + " szó betöltve.");