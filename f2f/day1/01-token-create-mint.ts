import "dotenv/config"
import base58 from "bs58"
import * as Web3 from "@solana/web3.js"
import * as token from '@solana/spl-token'

const connection = new Web3.Connection(Web3.clusterApiUrl("devnet"))
const publicKey = new Web3.PublicKey('6nuLGjoXNn58pm7EQGV4c73xNhyDTk3c2JVCHcGAjXRd')
const decoded = base58.decode(process.env.PRIVATE_KEY as any)
const keyPair = Web3.Keypair.fromSecretKey(decoded)


async function main(){
    const tokenMint = await token.createMint(
        connection, 
        keyPair, 
        publicKey, 
        publicKey,
        9
    ) 
    console.log(tokenMint.toBase58());
}
// YJP9NxVatGvrAGkX2vcW9ufv1ekAebR4GkdPUNrWWgG
// 7iex7on2f7HuRoijLvwyqfBniiiprm9oT6rTo8MbUy8t

main();