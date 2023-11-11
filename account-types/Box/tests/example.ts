import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Example } from "../target/types/example";
import { Keypair } from "@solana/web3.js";
import assert from "assert";

describe("example", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const wallet = provider.wallet as anchor.Wallet;

  const program = anchor.workspace.Example as Program<Example>;

  it("Box Account", async () => {
    // Generate keypair for the new account
    const newAccountKp = new Keypair();

    const transactionSignature = await program.methods
      .initializeBox()
      .accounts({
        signer: wallet.publicKey,
        newAccount: newAccountKp.publicKey,
      })
      .signers([newAccountKp])
      .rpc();

    console.log("Your transaction signature", transactionSignature);
  });

  it("Account not boxed, expect fail", async () => {
    // Generate keypair for the new account
    const newAccountKp = new Keypair();

    try {
      await program.methods
        .initialize()
        .accounts({
          signer: wallet.publicKey,
          newAccount: newAccountKp.publicKey,
        })
        .signers([newAccountKp])
        .rpc();
    } catch (error) {
      assert(error);
      console.log(error.logs);
    }
  });
});
