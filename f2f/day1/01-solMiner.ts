import "dotenv/config"
import base58 from "bs58"
import * as Web3 from "@solana/web3.js"

const connection = new Web3.Connection(Web3.clusterApiUrl("devnet"))
const decoded = base58.decode(process.env.PRIVATE_KEY as any)
const keyPair = Web3.Keypair.fromSecretKey(decoded)
const airdropAmount = 4 * Web3.LAMPORTS_PER_SOL; // 1 SOL

async function main(){
    console.log(`Requesting airdrop for ${keyPair.publicKey}`);
    try{
        const signature = await connection.requestAirdrop(
            keyPair.publicKey,
            airdropAmount
        );
    }catch{

    }
    

    const balance = await connection.getBalance(keyPair.publicKey);
    console.log('balance', balance);
}
// setInterval(async () => {
//     try {
//       await main();
//     } catch (error) {
//       console.error(error);
//     }
// }, 5000); // Run every 5 seconds


main().catch((error) => {
  console.error(error);
});