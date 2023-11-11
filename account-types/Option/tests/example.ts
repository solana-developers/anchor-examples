import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Example } from "../target/types/example";
import { Keypair } from "@solana/web3.js";

describe("example", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Example as Program<Example>;

  it("Do not provide optional account", async () => {
    const randomKeypair = new Keypair();
    // Add your test here.
    const transactionSignature = await program.methods
      .optionalAccount()
      .accounts({
        requiredAccount: randomKeypair.publicKey,
        optionalAccount: null,
      })
      .rpc();
    console.log("Your transaction signature", transactionSignature);
  });

  it("Provide optional account", async () => {
    const randomKeypair = new Keypair();

    // Add your test here.
    const transactionSignature = await program.methods
      .optionalAccount()
      .accounts({
        requiredAccount: randomKeypair.publicKey,
        optionalAccount: randomKeypair.publicKey,
      })
      .rpc();
    console.log("Your transaction signature", transactionSignature);
  });
});
