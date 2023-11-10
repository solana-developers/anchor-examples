import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Example } from "../target/types/example";
import { SystemProgram, Keypair } from "@solana/web3.js";
import assert from "assert";

describe("example", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Example as Program<Example>;

  it("Test executable constraint", async () => {
    const transactionSignature = await program.methods
      .executableConstraint()
      .accounts({
        programAccount: SystemProgram.programId,
      })
      .rpc();
    console.log("Your transaction signature", transactionSignature);
  });

  it("Violate executable constraint, expect fail", async () => {
    // Random keypair to use as "programAccount" account in the instruction
    const randomKeypair = new Keypair();

    try {
      await program.methods
        .executableConstraint()
        .accounts({
          programAccount: randomKeypair.publicKey,
        })
        .rpc();
    } catch (error) {
      // Expect transaction to fail, since randomKeypair is not an executable program account
      assert.strictEqual(
        error.error.errorMessage,
        "An executable constraint was violated"
      );
    }
  });
});
