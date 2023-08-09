import "./App.css";
import idl from "./idl.json";
import React, { useState } from "react";
import { Program, AnchorProvider, web3 } from "@project-serum/anchor";
import { Buffer } from "buffer";
import { bs58 } from "bs58";

window.Buffer = Buffer;

function App() {
  const [walletAddress, setWalletAddress] = useState("");

  const [displayText, setDisplaySelectedText] = useState("");
  const [userInputText, setUserInputValue] = useState("");
  const [selectedOption, setSelectedOption] = useState("");

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
    if (!window.solana) {
      alert(
        "Solana wallet not found. Please install Sollet or Phantom extension."
      );
      return;
    }
    try {
      await window.solana.connect();
      let provider = await getProvider();
      const walletAddress = provider.wallet.publicKey.toString();
      setWalletAddress(walletAddress);
      console.log("ex: ", provider.wallet.publicKey.toString());
    } catch (err) {
      console.error("Error connecting wallet:", err);
    }
  };

  const submission = async () => {
    const new_account = web3.Keypair.generate();
    const provider = await getProvider();
    const programID = new web3.PublicKey(
      "2zckoqD4m172afxwgXVxG31j3TmWMmTwqWE4gSPa9j5a"
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
    try {
      const provider = await getProvider();
      const programID = new web3.PublicKey(
        "2zckoqD4m172afxwgXVxG31j3TmWMmTwqWE4gSPa9j5a"
      );
      const connection = new web3.Connection(network, {
        preflightCommitment: "processed",
      });
      // let transactionList = await connection.getSignaturesForAddress();
      const signatures = await connection.getConfirmedSignaturesForAddress2(provider.wallet.publicKey, { commitment: 'confirmed' });

      console.log(signatures)
      // const transactionSignatures = signatures.filter((signature) => {
      //   // console.log()
      //   console.log(signature.signer)
      //   console.log(provider.wallet.publicKey)
      //   return signature.signer.equals(provider.wallet.publicKey);
      // });
      // console.log(transactionSignatures)

      if (signatures.length === 0) {
        throw new Error("No transactions found for the given program ID.");
      }

      // let signatureList = transactionList.map(
      //   (transaction) => transaction.signature
      // );
      // let signatureTest = await Promise.all(signatureList.map(signature => signature.toString()));
      // let transactionDetails = await Promise.all(signatureTest.map(async signature => await connection.getTransaction(signature)));
      // console.log(transactionDetails[0]);
      // for (let i = 7; i < transactionDetails.length; i++) {
      //   console.log(transactionDetails[i]);
      // }
      // for (let i = 0; i < transactionSignatures.length; i++) {
      //   console.log(transactionSignatures[i]);
      // }
      // setOptions(signatureTest);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleOptionChange = async (event) => {
    setSelectedOption(event.target.value);
  };

  const checkTransaction = async (event) => {
    await setSelectedOption(event.target.value);
    const provider = await getProvider();
    try {
      console.log(selectedOption);
      const transaction = await provider.connection.getTransaction(
        selectedOption
      );
      console.log(transaction);
      setDisplaySelectedText(transaction.meta.logMessages[8])
    } catch (error) {
      console.error("Error fetching transaction:", error);
    }
  };


  return (
    <div>
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
      with an associated public address; If such exists,{" "}
      <button onClick={updateTransactionSignatures}>refresh button</button>
      <select value={selectedOption} onChange={handleOptionChange}>
        <option hidden value="">
          view and select here
        </option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
      ,<button onClick={checkTransaction}>click here to check</button>, here:
      <p>{displayText}</p>
    </div>
  );
}

export default App;
