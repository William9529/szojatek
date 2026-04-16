let currentMatches = [];
let spinIntervals = [];
// Csak nagybetűk, hogy az animáció alatt is az látszódjon
const abcLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const fullAbc = "AÁBCDEÉFGHIÍJKLMNOÓÖŐPQRSTUÚÜŰVWXYZ".split("");

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
    const slots = [document.getElementById('slot1'), document.getElementById('slot2'), document.getElementById('slot3')];
    
    lettersArray.forEach((char, i) => {
        slots[i].querySelector('.reel').innerText = char;
    });

    findMatches(letters);
    const stats = document.getElementById('stats');
    stats.innerText = `${currentMatches.length} találat`;
    stats.classList.remove('hidden');
    document.getElementById('show-results-btn').disabled = false;
    // Csak akkor rejtjük el a listát, ha új betűket generálunk kézzel vagy gombbal
}

function startSpin() {
    const spinBtn = document.getElementById('spin-btn');
    const slots = [document.getElementById('slot1'), document.getElementById('slot2'), document.getElementById('slot3')];
    
    spinBtn.disabled = true;
    spinBtn.innerText = "...";
    document.getElementById('results-wrapper').classList.add('hidden');

    // Animáció indítása
    slots.forEach(slot => {
        slot.classList.add('spinning');
        // Véletlenszerű nagybetű beállítása az animáció alatti villanáshoz
        slot.querySelector('.reel').innerText = abcLetters[Math.floor(Math.random() * abcLetters.length)];
    });

    let finalLetters = "";
    let foundValid = false;
    while (!foundValid) {
        finalLetters = "";
        for (let i = 0; i < 3; i++) {
            finalLetters += abcLetters[Math.floor(Math.random() * abcLetters.length)];
        }
        if (findMatches(finalLetters).length > 0) foundValid = true;
    }

    // Sokkal gyorsabb leállás (300ms, 450ms, 600ms)
    finalLetters.split('').forEach((char, i) => {
        setTimeout(() => {
            const slot = slots[i];
            slot.classList.remove('spinning');
            slot.querySelector('.reel').innerText = char;

            if (i === 2) {
                spinBtn.disabled = false;
                spinBtn.innerText = "Random";
                updateUI(finalLetters);
            }
        }, 300 + (i * 150));
    });
}

function showResults() {
    const wrapper = document.getElementById('results-wrapper');
    const list = document.getElementById('results-list');
    const sidebar = document.getElementById('abc-sidebar');
    
    if (!wrapper.classList.contains('hidden')) {
        wrapper.classList.add('hidden');
        return;
    }

    const sortedWords = [...currentMatches].sort((a, b) => a.localeCompare(b, 'hu'));
    list.innerHTML = sortedWords.map(w => `<li data-first="${w[0].toUpperCase()}">${w}</li>`).join('');
    
    const existingFirstLetters = new Set(sortedWords.map(w => w[0].toUpperCase()));
    sidebar.innerHTML = fullAbc.map(char => `
        <div class="abc-letter ${existingFirstLetters.has(char) ? '' : 'hidden'}" onclick="jumpTo('${char}')">${char}</div>
    `).join('');

    wrapper.classList.remove('hidden');
    list.scrollTop = 0;
}

function jumpTo(letter) {
    const list = document.getElementById('results-list');
    const target = list.querySelector(`li[data-first="${letter}"]`);
    if (target) {
        list.scrollTo({
            top: target.offsetTop - list.offsetTop,
            behavior: 'smooth'
        });
    }
}

document.getElementById('spin-btn').addEventListener('click', startSpin);
document.getElementById('show-results-btn').addEventListener('click', showResults);
document.getElementById('manual-btn').addEventListener('click', () => {
    const input = document.getElementById('manual-input').value;
    if (input.length === 3) {
        document.getElementById('results-wrapper').classList.add('hidden');
        updateUI(input);
    }
});