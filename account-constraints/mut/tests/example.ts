import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Example } from "../target/types/example";
import { Keypair } from "@solana/web3.js";

describe("example", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const wallet = provider.wallet as anchor.Wallet;

  const program = anchor.workspace.Example as Program<Example>;

  it("Mut Constraint", async () => {
    // generate a new random keypair to use as the "to" account
    const toKeypair = new Keypair();

    // transfer amount in lamports
    const amount = new anchor.BN(1_000_000);

    const transactionSignature = await program.methods
      .mutConstraint(amount)
      .accounts({
        from: wallet.publicKey,
        to: toKeypair.publicKey,
      })
      .rpc();

    console.log("Your transaction signature", transactionSignature);
  });
});
