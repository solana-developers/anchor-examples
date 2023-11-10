import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Example } from "../target/types/example";
import { sendAndConfirmTransaction, Keypair } from "@solana/web3.js";
import assert from "assert";

describe("example", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const wallet = provider.wallet as anchor.Wallet;
  const connection = provider.connection;
  const program = anchor.workspace.Example as Program<Example>;

  it("Signer Constraint Pass", async () => {
    // Use the provider wallet as the "signer" account in the instruction
    const transaction = await program.methods
      .signerConstraint()
      .accounts({
        signer: wallet.publicKey,
      })
      .transaction();

    // Send transaction with the provider wallet as the signer
    const transactionSignature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [wallet.payer]
    );

    console.log("Your transaction signature", transactionSignature);
  });

  it("Signer Constraint Expect Fail", async () => {
    // Random keypair to use as the "signer" account in the instruction
    const randomKeypair = new Keypair();

    try {
      const transaction = await program.methods
        .signerConstraint()
        .accounts({
          signer: randomKeypair.publicKey, // not included as a signer
        })
        .transaction();

      // Send transaction without signing with the random keypair
      await sendAndConfirmTransaction(connection, transaction, [wallet.payer]);
    } catch (error) {
      // Expect transaction to fail
      assert.strictEqual(error.message, "Signature verification failed");
    }
  });
});
