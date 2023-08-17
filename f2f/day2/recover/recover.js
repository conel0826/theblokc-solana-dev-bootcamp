const bs58 = require('bs58');
const fs = require('fs');
b = bs58.decode('2HBeKqAK5yhGvNqYQu6KKhwJYXoXS96xqG38PtgazwXmKpbVGYYbqWY1GbafifHrZ4kYiiW54qpw5nWwDChHZDCX');
j = new Uint8Array(b.buffer, b.byteOffset, b.byteLength / Uint8Array.BYTES_PER_ELEMENT);
fs.writeFileSync('key.json', `[${j}]`);