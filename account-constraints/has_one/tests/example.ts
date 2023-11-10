import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Example } from "../target/types/example";
import { Keypair, sendAndConfirmTransaction } from "@solana/web3.js";
import assert from "assert";

describe("example", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const wallet = provider.wallet as anchor.Wallet;
  const connection = provider.connection;

  const program = anchor.workspace.Example as Program<Example>;

  const newAccountKp = new Keypair();

  it("Create account", async () => {
    // Instruction data
    const input = new anchor.BN(42);

    // Send transaction to initialize the new account
    const transactionSignature = await program.methods
      .initialize(input)
      .accounts({
        authority: wallet.publicKey,
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
    assert(accountData.authority.toBase58() == wallet.publicKey.toBase58());
  });

  it("Update account with has_one constraint", async () => {
    // Instruction data
    const input = new anchor.BN(24);

    // Send transaction to initialize the new account
    const transactionSignature = await program.methods
      .update(input)
      .accounts({
        authority: wallet.publicKey,
        existingAccount: newAccountKp.publicKey,
      })
      .rpc();

    console.log("Your transaction signature", transactionSignature);

    // Fetch the newly created account
    const accountData = await program.account.dataAccount.fetch(
      newAccountKp.publicKey
    );

    assert(accountData.data.eq(input));
  });

  it("Violate has_one constraint, expect fail", async () => {
    // Random keypair to use as "authority" account in the instruction
    const randomKeypair = new Keypair();

    // Instruction data
    const input = new anchor.BN(24);

    try {
      const transaction = await program.methods
        .update(input)
        .accounts({
          authority: randomKeypair.publicKey,
          existingAccount: newAccountKp.publicKey,
        })
        .transaction();

      await sendAndConfirmTransaction(connection, transaction, [
        wallet.payer, // transaction fee payer
        randomKeypair, // include as signer to satisfy signer check
      ]);
    } catch (error) {
      // The "authority" we provide does not match the "authority" stored on the account, expect transaction to fail
      assert.strictEqual(
        error.logs[2],
        "Program log: AnchorError caused by account: existing_account. Error Code: ConstraintHasOne. Error Number: 2001. Error Message: A has one constraint was violated."
      );
    }
  });
});
