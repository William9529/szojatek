let currentMatches = [];
let spinIntervals = [];
const abc = "abcdefghijklmnopqrstuvwxyz";

const normalizeText = (text) => {
    return text.toLowerCase()
        .replace(/á/g, 'a').replace(/é/g, 'e').replace(/[í]/g, 'i')
        .replace(/[óöő]/g, 'o').replace(/[úüű]/g, 'u');
};

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

function updateUI(letters) {
    const lettersArray = letters.toUpperCase().split('');
    for (let i = 0; i < 3; i++) {
        const slot = document.getElementById(`slot${i+1}`);
        slot.innerHTML = `<div class="letter">${lettersArray[i]}</div>`;
    }

    const stats = document.getElementById('stats');
    stats.innerText = `${currentMatches.length} szót találtam ehhez: ${letters.toUpperCase()}`;
    
    document.getElementById('show-results-btn').disabled = (currentMatches.length === 0);
    const list = document.getElementById('results-list');
    list.classList.add('hidden');
    list.innerHTML = '';
}

function handleManual() {
    const val = document.getElementById('manual-input').value.trim();
    if (val.length !== 3) {
        alert("PONTOSAN 3 betűre van szükség!");
        return;
    }
    findMatches(val);
    updateUI(val);
}

function startSpin() {
    if (document.getElementById('letters-box').classList.contains('spinning')) return;

    const lettersBox = document.getElementById('letters-box');
    const spinBtn = document.getElementById('spin-btn');
    
    lettersBox.classList.add('spinning');
    spinBtn.innerText = "Sorsolás...";
    spinBtn.disabled = true;

    // Vizuális pörgés
    for (let i = 0; i < 3; i++) {
        const slot = document.getElementById(`slot${i+1}`);
        spinIntervals[i] = setInterval(() => {
            const randomLetter = abc[Math.floor(Math.random() * abc.length)];
            slot.innerHTML = `
                <div class="letter">${randomLetter.toUpperCase()}</div>
                <div class="letter">${abc[Math.floor(Math.random() * abc.length)].toUpperCase()}</div>
            `;
        }, 60);
    }

    // Háttérben garancia a találatra
    let finalLetters = "";
    let foundValid = false;
    while (!foundValid) {
        finalLetters = "";
        for (let i = 0; i < 3; i++) {
            finalLetters += abc[Math.floor(Math.random() * abc.length)];
        }
        if (findMatches(finalLetters).length > 0) foundValid = true;
    }

    // Rövid pörgés (0.7 mp)
    setTimeout(() => {
        spinIntervals.forEach(interval => clearInterval(interval));
        spinIntervals = [];
        lettersBox.classList.remove('spinning');
        spinBtn.disabled = false;
        spinBtn.innerText = "Új betűk generálása";
        updateUI(finalLetters);
    }, 700);
}

function showResults() {
    const list = document.getElementById('results-list');
    const sortedWords = [...currentMatches].sort((a, b) => a.localeCompare(b, 'hu'));
    list.innerHTML = sortedWords.slice(0, 80000).map(w => `<li>${w}</li>`).join('');
    list.classList.toggle('hidden');
}

// Event Listeners
document.getElementById('spin-btn').addEventListener('click', startSpin);
document.getElementById('show-results-btn').addEventListener('click', showResults);
document.getElementById('manual-btn').addEventListener('click', handleManual);
document.getElementById('manual-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleManual();
});