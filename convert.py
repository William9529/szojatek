import re
import json

# Válaszd ki az sql fájlod nevét
input_file = 'hungarian_words.sql'
output_file = 'szavak.json'

words = []
# Regex a szavak kinyeréséhez az (id, 'szó') formátumból
pattern = re.compile(r"\(\d+,\s*'([^']+)'\)")

with open(input_file, 'r', encoding='utf8') as f:
    for line in f:
        matches = pattern.findall(line)
        for word in matches:
            words.append(word.lower())

# JSON mentése (egyszerű lista formátumban)
with open(output_file, 'w', encoding='utf8') as f:
    json.dump(words, f, ensure_ascii=False)

print(f"Kész! {len(words)} szó elmentve.")