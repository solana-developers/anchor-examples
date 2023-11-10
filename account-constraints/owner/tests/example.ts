import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Example } from "../target/types/example";
import {
  Keypair,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import assert from "assert";

describe("example", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const wallet = provider.wallet as anchor.Wallet;
  const connection = provider.connection;

  const program = anchor.workspace.Example as Program<Example>;

  // Generate a new random keypair to create a new account
  const newAccount = new Keypair();

  // Create a new account and set our program as the owner
  before(async () => {
    // Calculate minimum lamports for 0 space
    const rentLamports = await connection.getMinimumBalanceForRentExemption(0);

    // Instruction to create new account, set our program as owner
    const createAccountInstruction = SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: newAccount.publicKey,
      space: 0,
      lamports: rentLamports,
      programId: program.programId,
    });

    // Create a new transaction with above instruction
    const transaction = new Transaction().add(createAccountInstruction);

    // Send transaction
    await sendAndConfirmTransaction(connection, transaction, [
      wallet.payer,
      newAccount,
    ]);
  });

  it("Test owner constraint", async () => {
    const transactionSignature = await program.methods
      .ownerConstraint()
      .accounts({ programOwnedAccount: newAccount.publicKey })
      .rpc();
    console.log("Your transaction signature", transactionSignature);
  });

  it("Violate owner constraint, expect fail", async () => {
    // Generate random keypair to use as "programOwnedAccount" account in the instruction
    const randomKeypair = new Keypair();

    try {
      await program.methods
        .ownerConstraint()
        .accounts({ programOwnedAccount: randomKeypair.publicKey })
        .rpc();
    } catch (error) {
      // expect transaction to fail, since randomKeypair is not an account owned by our program
      assert.strictEqual(
        error.error.errorMessage,
        "An owner constraint was violated"
      );
    }
  });

  it("Test owner constraint 2", async () => {
    const transactionSignature = await program.methods
      .ownerConstraint2()
      .accounts({
        systemAccount: wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
    console.log("Your transaction signature", transactionSignature);
  });

  it("Violate owner constraint 2, expect fail", async () => {
    try {
      await program.methods
        .ownerConstraint2()
        .accounts({
          systemAccount: newAccount.publicKey, // this is owned by our program, not system program
          systemProgram: SystemProgram.programId,
        })
        .rpc();
    } catch (error) {
      // expect transaction to fail, since randomKeypair is not an account owned by our program
      assert.strictEqual(
        error.error.errorMessage,
        "An owner constraint was violated"
      );
    }
  });
});
