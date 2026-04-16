const fs = require('fs');

// 1. A fájl beolvasása (szinkron módon, hogy egyszerű legyen)
try {
    const data = fs.readFileSync('szavak.json', 'utf8');

    // 2. A szöveges adat átalakítása JavaScript tömbbé
    const szavakTomb = JSON.parse(data);

    // 3. A tömb hosszának kiírása
    console.log(`A fájlban összesen ${szavakTomb.length} szó található.`);
} catch (err) {
    console.error("Hiba történt a fájl beolvasásakor:", err.message);
}