```
// 03-mint-nft
import { createMetaplexInstance } from "../day_2/metaplex";
async function main() {
    const metaplex = createMetaplexInstance()
    const { nft } = await metaplex.nfts().create({
        uri: 'https://arweave.net/1RjPL9fDgCvBOBdI-fbCD8Nb_FYIo5diPPu6BML3UCw',
        name: 'ngbthehandsome',
        sellerFeeBasisPoints: 5000 //royalty fee 50%
    },
    {
        commitment: 'finalized'
    });
    console.log(nft)
}

main();
```