import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Example } from "../target/types/example";
import { Keypair } from "@solana/web3.js";
import { createAccount, createMint } from "@solana/spl-token";

describe("example", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const wallet = provider.wallet as anchor.Wallet;
  const connection = provider.connection;

  const program = anchor.workspace.Example as Program<Example>;

  // Keypair to use as address of new account
  const newAccountKp = new Keypair();

  it("Is initialized!", async () => {
    // Instruction data
    const input = new anchor.BN(42);

    const transactionSignature = await program.methods
      .initialize(input)
      .accounts({
        signer: wallet.publicKey,
        newAccount: newAccountKp.publicKey,
      })
      .signers([newAccountKp])
      .rpc();

    console.log("Your transaction signature", transactionSignature);
  });
  it("Anchor Account Type Examples", async () => {
    // Create new mint account
    const mint = await createMint(
      connection,
      wallet.payer, // payer
      wallet.publicKey, // mint authority
      null, // freeze authority
      2 // decimals
    );

    // Create new token account
    const token = await createAccount(
      connection,
      wallet.payer,
      mint,
      wallet.publicKey,
      new Keypair()
    );

    // Anchor automatically performs an owner check and deserializes the account data
    const transactionSignature = await program.methods
      .accountType()
      .accounts({
        existingAccount: newAccountKp.publicKey,
        token: token,
        mint: mint,
      })
      .rpc();

    console.log("Your transaction signature", transactionSignature);
  });
});
