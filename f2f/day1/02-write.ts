import base58 from "bs58";
import 'dotenv/config';
import * as Web3 from '@solana/web3.js';
// typescript

// const MY_PUBLIC_KEY = '8Stgd3EniwdN4zh8i4b5xqJgcmvKHLtZg5vXahfX1zHj'
// const SOMEONES_PUBLIC_KEY = 'DpqLuBbowaLGJNvo9X9Fam2qwk2uevjzZqEQqrSybEX'

async function main(){
    const decoded = base58.decode(process.env.PRIVATE_KEY as any)
    const keyPair = Web3.Keypair.fromSecretKey(decoded)
    console.log('publicKey', keyPair.publicKey)
    const publicKeyFrom = new Web3.PublicKey('6nuLGjoXNn58pm7EQGV4c73xNhyDTk3c2JVCHcGAjXRd');
    const publicKeyTo = new Web3.PublicKey('G3hS9aqBirC4UbP2SD3RXp4rxJ8Ev3GhKHJpj6YU6aFd');

    const instruction = Web3.SystemProgram.transfer({
        fromPubkey: publicKeyFrom,
        toPubkey: publicKeyTo,
        lamports: 100000000,
    });
    const transaction = new Web3.Transaction();
    transaction.add(instruction);

    const connection = new Web3.Connection(Web3.clusterApiUrl('devnet'))
    const txSignature = Web3.sendAndConfirmTransaction(connection, transaction, [keyPair])
    console.log('txHash', txSignature)
}

main();