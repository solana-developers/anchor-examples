import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Example } from "../target/types/example";
import { Keypair } from "@solana/web3.js";
import { createMint, getMint } from "@solana/spl-token";
import assert from "assert";

describe("example", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const wallet = provider.wallet as anchor.Wallet;
  const connection = provider.connection;

  const program = anchor.workspace.Example as Program<Example>;

  // Random keypair to use as address of mint account
  const mint = new Keypair();
  it("Is initialized!", async () => {
    const transactionSignature = await program.methods
      .initialize()
      .accounts({
        signer: wallet.publicKey,
        mint: mint.publicKey,
      })
      .signers([mint])
      .rpc();

    console.log("Your transaction signature", transactionSignature);

    const mintAccount = await getMint(connection, mint.publicKey);
    assert(mintAccount.mintAuthority.toBase58() == wallet.publicKey.toBase58());
    assert(
      mintAccount.freezeAuthority.toBase58() == wallet.publicKey.toBase58()
    );
  });

  it("Use mint contraint to validate account", async () => {
    const transactionSignature = await program.methods
      .accountValidation()
      .accounts({
        signer: wallet.publicKey,
        mint: mint.publicKey,
      })
      .rpc();

    console.log("Your transaction signature", transactionSignature);
  });

  it("Violate mint contraint, expect fail", async () => {
    // Create new mint with random mint authority
    const mint = await createMint(
      connection,
      wallet.payer,
      new Keypair().publicKey, // random mint authority
      null, // no freeze authority
      9 // decimals
    );

    try {
      await program.methods
        .accountValidation()
        .accounts({
          signer: wallet.publicKey,
          mint: mint,
        })
        .rpc();
    } catch (error) {
      // Mint authority for `mint` account does not match `signer`
      // Would also fail freeze authority check
      assert.strictEqual(
        error.message,
        "AnchorError occurred. Error Code: ConstraintMintMintAuthority. Error Number: 2016. Error Message: A mint mint authority constraint was violated."
      );
    }
  });
});
