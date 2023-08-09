import "dotenv/config"
import base58 from "bs58"
import * as Web3 from "@solana/web3.js"
import * as Token from '@solana/spl-token'


const connection = new Web3.Connection(Web3.clusterApiUrl("devnet"))
const decoded = base58.decode(process.env.PRIVATE_KEY as any)
const myKeyPair = Web3.Keypair.fromSecretKey(decoded)
const tokenMint = new Web3.PublicKey("7iex7on2f7HuRoijLvwyqfBniiiprm9oT6rTo8MbUy8t")
const tokenAccount = new Web3.PublicKey("G2kKTdJxLdzSGZejWut78XwFhEwKQBVyi1AKZprvVUBE")

async function main(){
    const minted_token = await Token.mintTo(
        connection,
        myKeyPair, // signer
        tokenMint, // mint
        tokenAccount, // bascically kung sino yung magiging new owner
        myKeyPair.publicKey, // the one who can block the transaction
        100000 * Web3.LAMPORTS_PER_SOL
    );
    console.log(minted_token)
}
// sWjs3D1dscQGVzKnHxh8MVZBN4jaETrm5bf93muTPyddtsiMiKEvqkZBgHX2Wf4xTvU6XtGY6XQbi2rcaNBpWAR

main();