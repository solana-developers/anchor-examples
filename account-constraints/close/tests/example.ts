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

  // Keypair to use as address of new account
  const newAccountKp = new Keypair();

  it("Create account", async () => {
    // Instruction data
    const input = new anchor.BN(42);

    // Send transaction to initialize the new account
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

    assert(accountData.data.eq(input));
  });

  it("Close account", async () => {
    // Send transaction to close the account
    const transactionSignature = await program.methods
      .close()
      .accounts({
        signer: wallet.publicKey,
        existingAccount: newAccountKp.publicKey,
      })
      .rpc();

    console.log("Your transaction signature", transactionSignature);

    try {
      // Expect error when fetching account since it was closed
      await program.account.dataAccount.fetch(newAccountKp.publicKey);
    } catch (error) {
      assert.strictEqual(
        error.message,
        `Account does not exist or has no data ${newAccountKp.publicKey.toBase58()}`
      );
    }
  });
});
