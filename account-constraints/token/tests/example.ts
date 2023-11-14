import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Example } from "../target/types/example";
import { Keypair, PublicKey } from "@solana/web3.js";
import { createMint, getAccount } from "@solana/spl-token";
import assert from "assert";

describe("example", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const wallet = provider.wallet as anchor.Wallet;
  const connection = provider.connection;

  const program = anchor.workspace.Example as Program<Example>;

  // Random keypair to use as address of token account
  const token = new Keypair();

  // Random mint account address
  let mint: PublicKey;

  it("Is initialized!", async () => {
    // Create new mint account
    mint = await createMint(
      connection,
      wallet.payer, // payer
      wallet.publicKey, // mint authority
      null, // freeze authority
      2 // decimals
    );

    const transactionSignature = await program.methods
      .initialize()
      .accounts({
        signer: wallet.publicKey,
        token: token.publicKey,
        mint: mint,
      })
      .signers([token])
      .rpc();

    console.log("Your transaction signature", transactionSignature);

    const tokenAccount = await getAccount(connection, token.publicKey);
    assert(tokenAccount.mint.toBase58() == mint.toBase58());
    assert(tokenAccount.owner.toBase58() == wallet.publicKey.toBase58());
  });

  it("Use token constraint to validate account", async () => {
    const transactionSignature = await program.methods
      .accountValidation()
      .accounts({
        signer: wallet.publicKey,
        token: token.publicKey,
        mint: mint,
      })
      .rpc();

    console.log("Your transaction signature", transactionSignature);
  });

  it("Violate token constraint, wrong authority", async () => {
    // Random keypair to use as address of `signer` account
    const randomKey = new Keypair();

    try {
      await program.methods
        .accountValidation()
        .accounts({
          signer: randomKey.publicKey,
          token: token.publicKey,
          mint: mint,
        })
        .signers([randomKey])
        .rpc();
    } catch (error) {
      assert.strictEqual(
        error.message,
        "AnchorError occurred. Error Code: ConstraintTokenOwner. Error Number: 2015. Error Message: A token owner constraint was violated."
      );
    }
  });

  it("Violate token constraint, wrong mint", async () => {
    // Create new mint account
    const mint = await createMint(
      connection,
      wallet.payer, // payer
      wallet.publicKey, // mint authority
      null, // freeze authority
      2 // decimals
    );

    try {
      await program.methods
        .accountValidation()
        .accounts({
          signer: wallet.publicKey,
          token: token.publicKey,
          mint: mint,
        })
        .rpc();
    } catch (error) {
      assert.strictEqual(
        error.message,
        "AnchorError occurred. Error Code: ConstraintTokenMint. Error Number: 2014. Error Message: A token mint constraint was violated."
      );
    }
  });
});
