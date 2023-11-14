import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Example } from "../target/types/example";
import { PublicKey, Keypair } from "@solana/web3.js";
import assert from "assert";

describe("example", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const wallet = provider.wallet as anchor.Wallet;

  const program = anchor.workspace.Example as Program<Example>;

  // Generate keypair for the new account
  const newAccountKp = new Keypair();

  it("Is initialized!", async () => {
    // Instruction data
    const input = new anchor.BN(42);

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
    assert(accountData.pubkey.equals(wallet.publicKey));
  });

  it("Update account data", async () => {
    // Instruction data
    const input = new anchor.BN(24);

    const transactionSignature = await program.methods
      .update(input)
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

    assert(accountData.data.eq(input));
    assert(accountData.pubkey.equals(wallet.publicKey));
  });

  it("Violate address constraint, expect fail", async () => {
    // Random keypair to use as "address" account in the instruction
    const randomKeypair = new Keypair();

    // Instruction data
    const input = new anchor.BN(24);

    try {
      await program.methods
        .update(input)
        .accounts({
          signer: randomKeypair.publicKey,
          existingAccount: newAccountKp.publicKey,
        })
        .signers([randomKeypair])
        .rpc();
    } catch (error) {
      // Expect transaction to fail, since address does not match constraint
      assert.strictEqual(
        error.error.errorMessage,
        "An address constraint was violated"
      );
    }
  });

  it("Test hardcoded address constraint", async () => {
    // Address that matches the hardcoded address in the program
    const hardcodedPubkey = new PublicKey(
      "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
    );

    const transactionSignature = await program.methods
      .hardcodedAddress()
      .accounts({
        account: hardcodedPubkey,
      })
      .rpc();

    console.log("Your transaction signature", transactionSignature);
  });

  it("Violate hardcoded address constraint, expect fail", async () => {
    // Random keypair to use as "address" account in the instruction
    const randomKeypair = new Keypair();

    try {
      await program.methods
        .hardcodedAddress()
        .accounts({
          account: randomKeypair.publicKey,
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
