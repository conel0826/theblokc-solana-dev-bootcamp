import "./App.css";
import idl from "./client_string_input.json";
import React, { useState } from "react";
import { Program, AnchorProvider, web3 } from "@project-serum/anchor";
import { Buffer } from "buffer";
import logo from "./Airplane-image-royalty-free-PNG.png"
import logo2 from "./Ph_fil_cebu.png"
import logo3 from "./363899081_323188883394043_2077306298904923730_n.jpg"

window.Buffer = Buffer;
var walletConnection = false;

function App() {
  const [displayText, setDisplaySelectedText] = useState("");
  const [userInputText, setUserInputValue] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [link, setLink] = useState("");

  const [options, setOptions] = useState([]);

  const network = web3.clusterApiUrl("devnet");

  const getProvider = async () => {
    const connection = new web3.Connection(network, {
      preflightCommitment: "processed",
    });
    const anchorProvider = new AnchorProvider(connection, window.solana, {
      preflightCommitment: "processed",
    });
    return anchorProvider;
  };

  const connectWallet = async () => {
    setUserInputValue("");
    if (walletConnection) {
      alert(
        "wallet already connected!"
      );
      return;
    }
    if (!window.solana) {
      alert(
        "Solana wallet not found. Please install Sollet or Phantom extension."
      );
      return;
    }
    try {
      await window.solana.connect();
      let provider = await getProvider();
      console.log("ex: ", provider.wallet.publicKey.toString());
      walletConnection = true;
      alert(
        "wallet connected!"
      );
    } catch (err) {
      console.error("Error connecting wallet:", err);
    }
  };

  const submission = async () => {
    if(!walletConnection){
      alert(
        "Solana wallet not found. Please connect Phantom Wallet First!"
      );
      return
    }

    const new_account = web3.Keypair.generate();
    const provider = await getProvider();
    const programID = new web3.PublicKey(
      "8WkpXvDdMrGXPcjkKa8XFBBCkfamMtoxbLmBMG2bPx6N"
    );
    const program = new Program(idl, programID, provider);
    console.log(userInputText);
    try {
      var Signature = await program.rpc.initialize(userInputText, {
        accounts: {
          newAccount: new_account.publicKey,
          signer: provider.wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        },
        signers: [new_account],
      });
      alert(
        "It might take some time for the transaction to process, please wait."
      );
      const transaction = await provider.connection.getTransaction(
        Signature,
        "confirmed"
      );
    } catch (err) {
      console.error("Transaction Error:", err);
    }
    setUserInputValue("");
  };

  // get list of transaction.. eme
  const updateTransactionSignatures = async () => {
    if(!walletConnection){
      alert(
        "Solana wallet not found. Please connect Phantom Wallet First!"
      );
      return
    }
    try {
      const provider = await getProvider();
      const programID = new web3.PublicKey(
        "8WkpXvDdMrGXPcjkKa8XFBBCkfamMtoxbLmBMG2bPx6N"
      );
      const connection = new web3.Connection(network, {
        preflightCommitment: "processed",
      });

      // the fun route
      var userSignaturesDetails = await connection.getSignaturesForAddress(
        provider.wallet.publicKey
      );
      var userSignatures = userSignaturesDetails.map((userSignatureDetail) =>
        userSignatureDetail.signature.trim()
      );
      console.log("userSignatures: ", userSignatures);

      var programSignaturesDetails = await connection.getSignaturesForAddress(
        programID
      );
      var programSignatures = programSignaturesDetails.map(
        (programSignatureDetail) => programSignatureDetail.signature.trim()
      );
      console.log("programSignatures: ", programSignatures);

      var transactionSignatures = programSignatures.filter((element) =>
        userSignatures.includes(element)
      );
      console.log("transactionSignatures: ", transactionSignatures);

      if (transactionSignatures.length === 0) {
        throw new Error("No transactions found for the given program ID.");
      }
      setOptions(transactionSignatures);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleOptionChange = async (event) => {
    setSelectedOption(event.target.value);
  };

  const checkTransaction = async (event) => {
    if(!walletConnection){
      alert(
        "Solana wallet not found. Please connect Phantom Wallet First!"
      );
      return
    }
    const provider = await getProvider();
    await setSelectedOption(event.target.value);
    setLink(`https://explorer.solana.com/tx/${selectedOption}?cluster=devnet`)
    console.log(`https://explorer.solana.com/tx/${selectedOption}?cluster=devnet`)
    
    try {
      console.log(selectedOption);
      const transaction = await provider.connection.getTransaction(
        selectedOption
      );
      
      console.log(transaction);
      setDisplaySelectedText(
        transaction.meta.logMessages[8].slice(13)
      );
    } catch (error) {
      console.error("Error fetching transaction:", error);
      alert(
        "You have no address selected!"
      );
    }
  };

  return (
    <div className="Kapogian">
      First,{" "}
      <button onClick={connectWallet}>
        click here to connect your local phantom wallet
      </button>
      , then,{" "}
      <input
        type="text"
        value={userInputText}
        onChange={(e) => setUserInputValue(e.target.value)}
        placeholder="input any text here"
      />
      , afterward, <button onClick={submission}>click here to submit</button>,
      note this submission, and more alike, are sent to the Solana blockchain,
      with it, an associated public address; If such transaction exists,{" "}
      <button onClick={updateTransactionSignatures}>
        click here to refresh the following:
      </button>
      ,{' '}
      <select value={selectedOption} onChange={handleOptionChange}>
        <option hidden value="">
          navigation of viewing and selection (note transactions may take time
          to render)
        </option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
      ,{' '}
      <button onClick={checkTransaction}>
        once selected an address, click here to check
      </button>
      , here:
      <p>
      Text Stored:{' '}
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
        >
          {displayText}
        </a>
      </p>
      <div className="cool">
      <img src={logo3} className="App-logo" alt="logo" />
      <img src={logo} className="App-logo" alt="logo" />
      <img src={logo2} className="App-logo" alt="logo" />
      </div>

    </div>
  );
}

export default App;
