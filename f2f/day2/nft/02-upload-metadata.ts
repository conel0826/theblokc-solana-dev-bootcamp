// 02-upload-metadata
import { createMetaplexInstance } from "../metaplex";
async function main() {
    const metaplex = createMetaplexInstance()
    const metadata = {
        name: 'ngbtheordinary',
        symbol: 'NGB',
        image: 'https://arweave.net/nY3jA5ylFr92bQANHXcQwE_9V9hifuhW2JOFkMjislQ',
        attributes: [
            {
                trait_type: 'author-is-handsome',
                value: '2'
            }
        ]
    }
    const result = await metaplex.nfts().uploadMetadata(metadata)
    console.log('result', result)
    console.log('uri', result.uri)
}
main();