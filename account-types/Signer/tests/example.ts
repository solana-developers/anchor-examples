import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Example } from "../target/types/example";
import { Keypair, sendAndConfirmTransaction } from "@solana/web3.js";

describe("example", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const wallet = provider.wallet as anchor.Wallet;
  const connection = provider.connection;

  const program = anchor.workspace.Example as Program<Example>;

  it("Signer Check", async () => {
    const randomKeypair = new Keypair();

    const transactionSignature = await program.methods
      .signers()
      .accounts({
        signer: wallet.publicKey, // automatically included as signer when using .rpc()
        signer2: randomKeypair.publicKey,
      })
      .signers([randomKeypair])
      .rpc();

    console.log("Your transaction signature", transactionSignature);
  });

  it("Signer Check", async () => {
    const randomKeypair = new Keypair();

    const transaction = await program.methods
      .signers()
      .accounts({
        signer: wallet.publicKey,
        signer2: randomKeypair.publicKey,
      })
      .transaction();

    const transactionSignature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [wallet.payer, randomKeypair]
    );

    console.log("Your transaction signature", transactionSignature);
  });
});
