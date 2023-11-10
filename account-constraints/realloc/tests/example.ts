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

  const newAccountKp = new Keypair();

  it("Create account", async () => {
    // Instruction data
    const input = "Hello Solana";

    const transactionSignature = await program.methods
      .initialize(input)
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

    assert(accountData.data == input);
  });

  it("Realloc, increase account size", async () => {
    // Instruction data
    const input = "Only Possible On Solana";

    const transactionSignature = await program.methods
      .realloc(input)
      .accounts({
        signer: wallet.publicKey,
        existingAccount: newAccountKp.publicKey,
      })
      .rpc();

    console.log("Your transaction signature", transactionSignature);

    // Fetch the newly created account
    const accountData = await program.account.dataAccount.fetch(
      newAccountKp.publicKey
    );

    assert(accountData.data == input);
  });

  it("Realloc, decrease account size", async () => {
    // Instruction data
    const input = "Solana";

    const transactionSignature = await program.methods
      .realloc(input)
      .accounts({
        signer: wallet.publicKey,
        existingAccount: newAccountKp.publicKey,
      })
      .rpc();

    console.log("Your transaction signature", transactionSignature);

    // Fetch the newly created account
    const accountData = await program.account.dataAccount.fetch(
      newAccountKp.publicKey
    );

    assert(accountData.data == input);
  });
});
