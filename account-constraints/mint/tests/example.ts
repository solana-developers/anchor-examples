import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Example } from "../target/types/example";
import { Keypair } from "@solana/web3.js";
import { getMint } from "@solana/spl-token";
import assert from "assert";

describe("example", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const wallet = provider.wallet as anchor.Wallet;
  const connection = provider.connection;

  const program = anchor.workspace.Example as Program<Example>;

  it("Is initialized!", async () => {
    // Random keypair to use as address of mint account
    const mint = new Keypair();

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
});
