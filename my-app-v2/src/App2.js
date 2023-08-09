// import Button from './components/Button'
import './App.css'
// import logo from './logo.png';
import {useState} from 'react'
import {Buffer} from 'buffer';
import idl from './idl.json'
import { Connection, PublicKey, clusterApiUrl  } from '@solana/web3.js';
import { Program, AnchorProvider, web3} from '@project-serum/anchor';
 
const {SystemProgram,Keypair} = web3;
window.Buffer = Buffer
const programID = new PublicKey('2zckoqD4m172afxwgXVxG31j3TmWMmTwqWE4gSPa9j5a')
const opts = {
    preflightCommitment:"processed",
}
const network = clusterApiUrl('devnet')
var new_account = Keypair.generate(); 

const App = () => {
  const [userInput, setUserInput] = useState("");
  const [walletaddress, setWalletAddress] = useState("");
  const { solana } = window;
  const [Tx, setTx] = useState("");
  const [txSig, setTxSig] = useState('');
  const [inputVal, setInput] = useState('');
  const [txDone, setTxDone] = useState(false);

  var Txsignature = null
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
    if (walletaddress) {
      new_account = Keypair.generate();
      window.solana.disconnect()
      setWalletAddress("")
      setInput('')
      setUserInput('')
      setTx(null)
    }

    if (!window.solana) {
      alert("Solana wallet not found. Please install Sollet or Phantom extension.");
      return;
    }

    // Connect the wallet using the provider
    try {
      await window.solana.connect();
      const provider = getProvider();
      const walletAddress = provider.wallet.publicKey.toString();
      setWalletAddress(walletAddress);
    } catch (err) {
      console.error("Error connecting wallet:", err);
    }
    };
  
    const input = async () => {
      new_account = Keypair.generate();
      setInput('')
      setTx(null)

      const dataAcc = new_account;
      console.log(dataAcc);
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
    
      try {
        Txsignature = await program.rpc.initialize(userInput, {
          accounts: {
            newAccount: new_account.publicKey,
            signer: provider.wallet.publicKey,
            systemProgram: SystemProgram.programId,
          },
          signers: [new_account],
        });  
        alert("It might take some time for the transaction to process, please wait.")
        const transaction = await provider.connection.getTransaction(Txsignature, 'confirmed');
        console.log(transaction)

        setTx(Txsignature);
        setTxDone(true)
        setTxSig(Txsignature.toString() )
        setUserInput('')
      } catch (err) {
        console.error("Transaction Error:", err);
      }

      setUserInput('')
    }

    const findTxRes = async () => {
      if (inputVal.length >= 2) {
        setInput('')
        return
      }
      try { 
        const provider = getProvider();
        const transaction = await provider.connection.getTransaction(Tx.toString(), 'confirmed');
        console.log(transaction)
        console.log('Transaction Confirmation:', transaction.meta.logMessages[8].slice(25)); 
        setInput(transaction.meta.logMessages[8].slice(26))
      } catch (error) {
        console.error('Error fetching transaction:', error); 
      }
    };     

    return (
      <div className="App">
          <header className="App-header">
            {/* <img src={logo} className="App-logo" alt="logo" /> */}
            <button onClick={connectWallet}>{walletaddress ? "Disconnect Wallet" :"Connect Wallet"}</button>
            {!walletaddress && <br />}
            {walletaddress && <p>Address: {walletaddress}</p>}
            {walletaddress && <input value={userInput} onChange={(e) => setUserInput(e.target.value)} />}
            <br />
            {walletaddress && <button onClick={input}>Submit</button>}
            {walletaddress && Tx && <p>Transaction Signature:</p>}
            {walletaddress && Tx && 
            <a
              href={`https://explorer.solana.com/tx/${Tx}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {Tx.toString()}
            </a>}
            {walletaddress && Tx && <br />}
            {walletaddress && Tx && <button onClick={findTxRes}>{inputVal.length >= 2 ? "Clear Transaction Input" : "Fetch Transaction Input"}</button>}
            {walletaddress && inputVal.length >= 2 && <p>Your input was: {inputVal}</p>}
          </header>
      </div>
    );
}

export default App;