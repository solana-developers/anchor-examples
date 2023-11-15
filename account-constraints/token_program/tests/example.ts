import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Example } from "../target/types/example";
import { Keypair, PublicKey } from "@solana/web3.js";
import {
  createMint,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import assert from "assert";

describe("example", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const wallet = provider.wallet as anchor.Wallet;
  const connection = provider.connection;

  const program = anchor.workspace.Example as Program<Example>;

  // Address of mint account
  let mint: PublicKey;

  before(async () => {
    // Create new mint account owned by Token 2022 program
    mint = await createMint(
      connection,
      wallet.payer,
      wallet.publicKey,
      null,
      9,
      new Keypair(),
      null,
      TOKEN_2022_PROGRAM_ID
    );
  });

  it("token_program constraint check", async () => {
    const transactionSignature = await program.methods
      .tokenProgram()
      .accounts({
        mint: mint,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .rpc();

    console.log("Your transaction signature", transactionSignature);
  });

  it("Violate token_program constraint, expect fail", async () => {
    try {
      // Use Token program instead of Token 2022 program
      await program.methods
        .tokenProgram()
        .accounts({
          mint: mint,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc();
    } catch (error) {
      // Expect fail because mint account is owned by Token 2022 program
      assert.strictEqual(
        error.message,
        "AnchorError occurred. Error Code: ConstraintMintTokenProgram. Error Number: 2022. Error Message: A mint token program constraint was violated."
      );
    }
  });
});
