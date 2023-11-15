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

  it("Initialize large zero copy account", async () => {
    // 10mb max account size, requires 72.98178048 SOL for rent
    // const space = 10_485_760;

    // 8 byte anchor discriminator + 10240 bytes for account data
    const space = 8 + 10240;

    // Calculate minimum lamports for space
    const rentLamports = await connection.getMinimumBalanceForRentExemption(
      space
    );

    // Instruction to create new account
    const createAccountInstruction = SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: newAccount.publicKey,
      space: space,
      lamports: rentLamports,
      programId: program.programId, // transfers ownership to our program once created
    });

    // Initialize the zero copy account (adds account discriminator)
    const initializeInstruction = await program.methods
      .initialize()
      .accounts({ newAccount: newAccount.publicKey })
      .instruction();

    const transaction = new Transaction().add(
      createAccountInstruction,
      initializeInstruction
    );

    const transactionSignature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [wallet.payer, newAccount]
    );

    console.log("Your transaction signature", transactionSignature);
  });

  it("Update data at specific index", async () => {
    const instructionData = {
      index: 0,
      input: 255, // data stored on account
      start: 0,
      end: 10,
    };

    const transactionSignature = await program.methods
      .update(
        instructionData.index,
        instructionData.input,
        instructionData.start,
        instructionData.end
      )
      .accounts({ existingAccount: newAccount.publicKey })
      .rpc();

    console.log("Your transaction signature", transactionSignature);

    const accountData = await program.account.dataAccount.fetch(
      newAccount.publicKey
    );

    assert.strictEqual(
      accountData.data[instructionData.index],
      instructionData.input
    );
  });
});
