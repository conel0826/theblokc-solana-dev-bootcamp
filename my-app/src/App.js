import React, { useState } from 'react';
import idl from './idl.json';
import { Program, AnchorProvider } from '@project-serum/anchor';
import * as web3 from '@solana/web3.js';

async function getPhantomProvider() {
  const isPhantomInstalled = typeof window.solana !== 'undefined';
  if (isPhantomInstalled) {
    const isConfirmed = window.confirm("Phantom wallet detected. Do you want to connect using Phantom?");
    if (isConfirmed) {
      const connection = new web3.Connection(web3.clusterApiUrl('devnet'));
      const wallet = window.solana;
      const provider = new AnchorProvider(connection, wallet);
      return provider;
    } else {
      throw new Error("User denied permission to use Phantom wallet.");
    }
  } else {
    throw new Error("Phantom wallet is not installed.");
  }
};

function App() {
  const programID = new web3.PublicKey('');
  var provider;

  const [selectedOption, setSelectedOption] = useState('');

  const options = ['Option 1', 'Option 2', 'Option 3'];

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  // Declare a state variable for input box
  const [userInputText, setInputValue] = useState("");
  
  const getProvider = async () => {
    provider = await getPhantomProvider();
  };

  // Function to handle the onClick event of first button
  const submission = async () => {
    const program = new Program(idl, programID, provider);
    await program.methods.initialize(userInputText).rpc();
  };

  return (
    <div>
      First,{' '}
      <button onClick={getProvider}>
        click here to connect your local phantom wallet
      </button>
      , then,{' '}
      <input 
        type="text" 
        value={userInputText} 
        onChange={ e => setInputValue(e.target.value)}
        placeholder="input any text here"
      />
      , afterward,{' '}
      <button onClick={submission}>
        click here to submit
      </button>
      , note this submission, and more alike, 
      are sent to the Solana blockchain, 
      with an associated public address; 
      If such exists, you may,{' '}
      <select 
        value={selectedOption} 
        onChange={handleOptionChange}
      >
        <option hidden value=''>view and select here</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
      , and here its associated submitted text: {selectedOption}
    </div>
  );
}

export default App;
