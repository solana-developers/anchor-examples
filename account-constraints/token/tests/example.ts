import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Example } from "../target/types/example";
import { Keypair } from "@solana/web3.js";
import { createMint, getAccount } from "@solana/spl-token";
import assert from "assert";

describe("example", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const wallet = provider.wallet as anchor.Wallet;
  const connection = provider.connection;

  const program = anchor.workspace.Example as Program<Example>;

  it("Is initialized!", async () => {
    // Random keypair to use as address of token account
    const token = new Keypair();

    // Create new mint account
    const mint = await createMint(
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
});
