import "dotenv/config"
import base58 from "bs58"
import * as Web3 from "@solana/web3.js"
import * as token from '@solana/spl-token'

const connection = new Web3.Connection(Web3.clusterApiUrl("devnet"))
const publicKey = new Web3.PublicKey('6nuLGjoXNn58pm7EQGV4c73xNhyDTk3c2JVCHcGAjXRd')
const decoded = base58.decode(process.env.PRIVATE_KEY as any)
const keyPair = Web3.Keypair.fromSecretKey(decoded)
const tokenMint = new Web3.PublicKey("7iex7on2f7HuRoijLvwyqfBniiiprm9oT6rTo8MbUy8t")

async function main(){
    const tokenAccount = await token.createAccount(
        connection, //connection
        keyPair, //signer
        tokenMint, //mint publi key 
        publicKey, // owner of the token-account
    )
    console.log(tokenAccount.toBase58());
}

//4Nuu1eoTP75HnE6Gj8MsWquQhwbPEGwMP4zFYcZHbZmq
//G2kKTdJxLdzSGZejWut78XwFhEwKQBVyi1AKZprvVUBE

main();