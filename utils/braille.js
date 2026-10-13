const BRAILLE_DOTS = {
  a: [1], b: [1, 2], c: [1, 4], d: [1, 4, 5], e: [1, 5],
  f: [1, 2, 4], g: [1, 2, 4, 5], h: [1, 2, 5], i: [2, 4], j: [2, 4, 5],
  k: [1, 3], l: [1, 2, 3], m: [1, 3, 4], n: [1, 3, 4, 5], o: [1, 3, 5],
  p: [1, 2, 3, 4], q: [1, 2, 3, 4, 5], r: [1, 2, 3, 5], s: [2, 3, 4], t: [2, 3, 4, 5],
  u: [1, 3, 6], v: [1, 2, 3, 6], w: [2, 4, 5, 6], x: [1, 3, 4, 6], y: [1, 3, 4, 5, 6],
  z: [1, 3, 5, 6],
};

const BRAILLE_UNICODE_OFFSET = 0x2800;

export function getBrailleDots(character) {
  return BRAILLE_DOTS[character.toLowerCase()] || [];
}

export function isBrailleLetter(character) {
  return character.toLowerCase() in BRAILLE_DOTS;
}

export function toBrailleUnicode(text) {
  return text
    .split("")
    .map((character) => {
      const mask = getBrailleDots(character).reduce((total, dot) => total + (1 << (dot - 1)), 0);
      return String.fromCharCode(BRAILLE_UNICODE_OFFSET + mask);
    })
    .join("");
}
