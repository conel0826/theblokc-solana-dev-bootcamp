'use client'
import './App.css';
import Image from "next/image"
import viper from './assets/viper.png'
import { useState, useEffect} from 'react'

import idl from './user_input.json'
import { Connection, PublicKey, clusterApiUrl  } from '@solana/web3.js';
import { Program, AnchorProvider, web3, } from '@project-serum/anchor';
import * as Web3 from '@solana/web3.js';
const {SystemProgram,Keypair} = web3;
const bs58 = require('bs58');


const rpcUrl = 'https://api.testnet.solana.com';
const method = 'getProgramAccounts';
const programPubkey = 'UhH9QdWTjFedFNtasBBaxwP7A52JPipkVMqBZuLR6QB';




const programID = new PublicKey('UhH9QdWTjFedFNtasBBaxwP7A52JPipkVMqBZuLR6QB')
const opts = {
  preflightCommitment:"processed",
}


//const network = "http://127.0.0.1:8899";  // for localnet
//const network = clusterApiUrl("devnet") // for devnet
const network = clusterApiUrl("testnet") // for testnet


const new_account = Keypair.generate();
console.log(new_account)

function Frontpage() {
  
  const [userInput, setUserInput] = useState("");
  const [walletaddress, setWalletAddress] = useState("");
  const [Tx, setTx] = useState("");
  const [txSig, setTxSig] = useState('');
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [txDone, setTxDone] = useState(false);
  const [transactions, setTransactions] = useState([]);



  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new AnchorProvider(
      connection,
      window.solana,
      opts.preflightCommitment
    );
    return provider;
  };

  const connectWallet = async () => {
    if (!window.solana) {
      alert("Solana wallet not found. Please install Sollet or Phantom extension.");
      return;
    }

    try {
      await window.solana.connect();
      const provider = getProvider();
      const walletAddress = provider.wallet.publicKey.toString();
      setWalletAddress(walletAddress);
    } catch (err) {
      console.error("Error connecting wallet:", err);
    }
  };




async function input() {
  const dataAcc = new_account;
  console.log(dataAcc);
  const provider = getProvider();
  const program = new Program(idl, programID, provider);

  try {

    const txSignature = await program.rpc.initialize(userInput, {
      accounts: {
        newAccount: new_account.publicKey,
        signer: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [new_account],
    });

    const confirmation = await provider.connection.confirmTransaction(txSignature, 'confirmed');
    console.log('Transaction Confirmation:', confirmation);


    console.log('Transaction Signature:', txSignature);

    setTx(txSignature);
     setTxDone(true)
    const account = await program.account.newAccount.fetch(new_account.publicKey);
    console.log('Output:', account);
  } catch (err) {
    console.error("Transaction Error:", err);
  }
}



  
const findTxRes = async () => {
  try {
    const conn = new Web3.Connection('https://api.testnet.solana.com');
    const fetchedTransaction = await conn.getConfirmedTransaction(txSig);

    console.log('tx :', fetchedTransaction)

    if (fetchedTransaction) {
      setTransactionDetails(fetchedTransaction);
    } else {
      console.log('Transaction not found.');
    }
  } catch (error) {
    console.error('Error fetching transaction:', error);
  }
};


const getAllTransactions = () => {
  const requestData = {
    jsonrpc: '2.0',
    id: 1,
    method: method,
    params: [programPubkey],
  };

  fetch(rpcUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),
  })
    .then((response) => response.json())
    .then((data) => {
      setTransactions(data.result); 
      console.log('Result ',data.result)
    })
    .catch((error) => {
      console.error('Error:', error);
    });
};

useEffect(() => {

  getAllTransactions();
}, []);

const output = (data) => {
  try {
    const bytes = bs58.decode(data);
    const asciiString = Buffer.from(bytes).toString('ascii');
    return asciiString;
  } catch (error) {
    console.error('Error decoding Base58 data:', error);
    return null;
  }
};


  return (

    
    <div className="App">
      <header className="App-header">
<p>This Dapp is currently connected at Solana Testnet Cluster</p>
<br/>
      <p style={{ fontSize: '16px', color: 'violet' }}>Address: {walletaddress}</p>
    <button onClick={connectWallet}>Connect Wallet</button>
    <Image src={viper} alt="Logo" height={100}width={360}className="App-logo" />
      
<p>Type Something in here</p>


  <input value={userInput} onChange={(e) => setUserInput(e.target.value)} />
<button onClick={input}>Submit</button>
<p style={{ fontSize: '16px', color: 'violet' }}>Signature: {Tx}</p>
{txDone && (
  <div>
          <p style={{ fontSize: 'smaller' }}>
            Transaction confirmed!{' '}
            <a
              href={`https://explorer.solana.com/tx/${Tx}?cluster=testnet`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View on Solana Explorer
            </a>
          </p>
          <p style={{ fontSize: '16px', color: 'yellow' }}>Please wait for a bit before trying to fetch</p>
          </div>
        )}  
<input
            type="text"
            value={txSig}
            onChange={(event) => setTxSig(event.target.value)}
            placeholder="Enter Transaction Signature"
          />
          <button onClick={findTxRes}>Fetch Transaction</button>
   
          {transactionDetails ? (
          <div>
            <h4>Transaction Details</h4>
            {transactionDetails.transaction.instructions.length >= 2 ? (
              <div>
                <p>
                  Your Input was {' '}
                  <strong>{transactionDetails.transaction.instructions[0].data.slice(8).toString()}</strong> in this
                  transaction
                </p>
              </div>
            ) : (
              <p>No transaction data available.</p>
            )}
          </div>
        ) : (
          <p></p>
        )}

      </header>
     <p style={{ fontSize: '16px', color: 'yellow' }}>All Transactions of this Dapp</p>
    <div>
          {transactions.map((transaction, index) => (
            <div key={index}>
              <p>Data Account: {transaction.pubkey}</p>
              <p>Data: {output(transaction.account.data).slice(6)}</p>
            </div>
          ))}
        </div>
    </div>
  );
}

export default Frontpage;