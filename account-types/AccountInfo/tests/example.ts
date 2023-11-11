import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Example } from "../target/types/example";
import { Keypair, SystemProgram } from "@solana/web3.js";

describe("example", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Example as Program<Example>;

  it("Pass in random keypair", async () => {
    const randomKeypair = new Keypair();
    const transactionSignature = await program.methods
      .accountInfo()
      .accounts({
        uncheckedAccount: randomKeypair.publicKey,
      })
      .rpc();
    console.log("Your transaction signature", transactionSignature);
  });

  it("Pass in system program", async () => {
    const transactionSignature = await program.methods
      .accountInfo()
      .accounts({
        uncheckedAccount: SystemProgram.programId,
      })
      .rpc();
    console.log("Your transaction signature", transactionSignature);
  });
});
