import "dotenv/config"
import base58 from "bs58"
import * as Web3 from '@solana/web3.js'
import * as token from '@solana/spl-token'

async function main() {
    const connection = new Web3.Connection(Web3.clusterApiUrl("devnet"))
    const decoded = base58.decode(process.env.PRIVATE_KEY as any)
    const myKeyPair = Web3.Keypair.fromSecretKey(decoded)
    const program_id = new Web3.PublicKey('2bRwXRJBUrzCd3Jg3mdTp1EQC6PW2AHxQDFLnEp4aiih')
    
    const balance = await connection.getBalance(myKeyPair.publicKey)
    console.log(balance)
    const instruction = new Web3.TransactionInstruction({
        keys: [ //array <accountmeta>
            {
                pubkey: myKeyPair.publicKey,
                isSigner: true,
                isWritable: false,
            }
        ],
        programId: program_id,
        data: Buffer.alloc(20), 
    });
    const transaction = new Web3.Transaction();
    transaction.add(instruction);
    const signature = await Web3.sendAndConfirmTransaction(
        connection,
        transaction,
        [myKeyPair]
    )
    console.log('SIGNATURE', signature)
}
main()
.then(() => process.exit(0))
.catch(err => {
    console.error(err)
});