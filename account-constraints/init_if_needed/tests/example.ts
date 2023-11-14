import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Example } from "../target/types/example";
import { Keypair, SystemProgram } from "@solana/web3.js";
import assert from "assert";
import {
  createMint,
  getAccount,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";

describe("example", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const wallet = provider.wallet as anchor.Wallet;
  const connection = provider.connection;

  const program = anchor.workspace.Example as Program<Example>;

  // Generate keypair for the new account
  const newAccountKp = new Keypair();

  // Instruction data
  const initialInput = new anchor.BN(42);
  const updatedInput = new anchor.BN(24);

  it("Create and initialize account", async () => {
    const transactionSignature = await program.methods
      .initialize(initialInput)
      .accounts({
        signer: wallet.publicKey,
        newAccount: newAccountKp.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([newAccountKp])
      .rpc();

    console.log("Your transaction signature", transactionSignature);

    // Fetch the newly created account
    const accountData = await program.account.dataAccount.fetch(
      newAccountKp.publicKey
    );

    assert(accountData.data.eq(initialInput));
  });

  it("Account already initialized, data remains unchanged", async () => {
    const transactionSignature = await program.methods
      .initialize(updatedInput)
      .accounts({
        signer: wallet.publicKey,
        newAccount: newAccountKp.publicKey,
      })
      .signers([newAccountKp])
      .rpc();

    console.log("Your transaction signature", transactionSignature);

    // Fetch the newly created account
    const accountData = await program.account.dataAccount.fetch(
      newAccountKp.publicKey
    );

    assert(accountData.data.eq(initialInput));
    assert.notEqual(accountData.data, updatedInput);
  });

  it("Initialize Associated Token Account if needed", async () => {
    // Create new mint account
    const mint = await createMint(
      connection,
      wallet.payer, // payer
      wallet.publicKey, // mint authority
      null, // freeze authority
      2 // decimals
    );

    // Derive associated token account address
    const associatedTokenAddress = getAssociatedTokenAddressSync(
      mint,
      wallet.publicKey
    );

    // Invoke initializeTokenAccount to create associated token account
    const transactionSignature = await program.methods
      .initializeTokenAccount()
      .accounts({
        signer: wallet.publicKey,
        associatedToken: associatedTokenAddress,
        mint: mint,
      })
      .rpc();

    console.log("Your transaction signature", transactionSignature);

    // Invoke initializeTokenAccount again
    // Instruction proceeds without error, even though the associated token account already exists
    const transactionSignature2 = await program.methods
      .initializeTokenAccount()
      .accounts({
        signer: wallet.publicKey,
        associatedToken: associatedTokenAddress,
        mint: mint,
      })
      .rpc();

    console.log("Your transaction signature", transactionSignature2);

    const tokenAccount = await getAccount(connection, associatedTokenAddress);
    assert(tokenAccount.mint.toBase58() == mint.toBase58());
    assert(tokenAccount.owner.toBase58() == wallet.publicKey.toBase58());
  });
});
