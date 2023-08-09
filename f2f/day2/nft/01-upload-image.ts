// 01-upload-image.ts
import fs from 'fs'
import { toMetaplexFile } from '@metaplex-foundation/js'
// how do you go to new line at auto complete
import { createMetaplexInstance } from '../metaplex'

const buffer = fs.readFileSync(__dirname + '/image.png');
const file = toMetaplexFile(buffer, "image.png");
const metaplex = createMetaplexInstance();

async function main(){
    const imageUrl = await metaplex.storage().upload(file);
    console.log('imageUrl',imageUrl);
}
main();