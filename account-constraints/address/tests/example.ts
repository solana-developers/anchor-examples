import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Example } from "../target/types/example";
import { PublicKey, Keypair } from "@solana/web3.js";
import assert from "assert";

describe("example", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Example as Program<Example>;

  it("Test address constraint", async () => {
    // Address that matches the hardcoded address in the program
    const hardcodedPubkey = new PublicKey(
      "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
    );

    const transactionSignature = await program.methods
      .addressConstraint()
      .accounts({
        address: hardcodedPubkey,
      })
      .rpc();

    console.log("Your transaction signature", transactionSignature);
  });

  it("Violate address constraint, expect fail", async () => {
    // Random keypair to use as "address" account in the instruction
    const randomKeypair = new Keypair();

    try {
      await program.methods
        .addressConstraint()
        .accounts({
          address: randomKeypair.publicKey,
        })
        .rpc();
    } catch (error) {
      // Expect transaction to fail, since address does not match constraint
      assert.strictEqual(
        error.error.errorMessage,
        "An address constraint was violated"
      );
    }
  });
});
