import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { MINT_SIZE, TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID, createInitializeMint2Instruction, createMint, getMinimumBalanceForRentExemptMint } from "@solana/spl-token"
export function TokenLaunchpad() {
    const { connection } = useConnection();
    const wallet = useWallet();
    async function createToken() {
        const mintKeyPair = Keypair.generate();
        const lamports = await getMinimumBalanceForRentExemptMint(connection);

        const transaction = new Transaction().add(SystemProgram.createAccount({
            fromPubkey : wallet.publicKey,
            newAccountPubkey: mintKeyPair.publicKey,
            space: MINT_SIZE,
            lamports,
            programId : TOKEN_PROGRAM_ID,
        }),
        createInitializeMint2Instruction(mintKeyPair.publicKey,9, wallet.publicKey, wallet.publicKey, TOKEN_PROGRAM_ID) 
    );
    transaction.feePayer= wallet.publicKey;
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    transaction.partialSign(mintKeyPair);
    await wallet.sendTransaction(transaction, connection);
    console.log(`token mint created at ${mintKeyPair.publicKey.toBase58()}`);

    }
    return <div style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    }}>
        <h1>Solana Token Launchpad</h1>
        <input className='inputText' type='text' placeholder='Name'></input> <br />
        <input className='inputText' type='text' placeholder='Symbol'></input> <br />
        <input className='inputText' type='text' placeholder='Image URL'></input> <br />
        <input className='inputText' type='text' placeholder='Initial Supply'></input> <br />
        <button onClick={createToken} className='btn'>Create a token</button>
    </div>
}