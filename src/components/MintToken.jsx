import { getAssociatedTokenAddressSync, createAssociatedTokenAccountInstruction, TOKEN_PROGRAM_ID, createMintToInstruction } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";
import { getAccount } from "@solana/spl-token";
export function MintToken({ mintAddress, onDone }) {
    const wallet = useWallet();
    const { connection } = useConnection();

    async function mint() {
    if (!wallet.publicKey) return;

    const associatedToken = getAssociatedTokenAddressSync(
        mintAddress,
        wallet.publicKey
    );

    const transaction = new Transaction();

    try {
        await getAccount(connection, associatedToken);
        console.log("Token account already exists");
    } catch {
        transaction.add(
            createAssociatedTokenAccountInstruction(
                wallet.publicKey,
                associatedToken,
                wallet.publicKey,
                mintAddress
            )
        );
    }

    const mintIx = createMintToInstruction(
        mintAddress,
        associatedToken,
        wallet.publicKey,
        1000000000 // 1 token with 9 decimals
    );

    const mintTx = transaction.add(mintIx);

    const signature = await wallet.sendTransaction(mintTx, connection);
    await connection.confirmTransaction(signature, "confirmed");

    console.log("Minting done for token " + mintAddress.toBase58());
    onDone();
}


    return <div>
        <input type="text"></input>
        <button onClick={mint}>Mint tokens</button>
    </div>
}