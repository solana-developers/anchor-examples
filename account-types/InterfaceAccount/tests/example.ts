import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Example } from "../target/types/example";
import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { Keypair } from "@solana/web3.js";
import assert from "assert";

describe("example", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const wallet = provider.wallet as anchor.Wallet;
  const connection = provider.connection;

  const program = anchor.workspace.Example as Program<Example>;

  it("Token Program", async () => {
    const mint = new Keypair();
    const token = new Keypair();

    const transactionSignature = await program.methods
      .interface()
      .accounts({
        signer: wallet.publicKey,
        mint: mint.publicKey,
        token: token.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([mint, token])
      .rpc();
    console.log("Your transaction signature", transactionSignature);

    const mintAccountInfo = await connection.getAccountInfo(mint.publicKey);
    assert(mintAccountInfo.owner.toBase58() === TOKEN_PROGRAM_ID.toBase58());

    const tokenAccountInfo = await connection.getAccountInfo(token.publicKey);
    assert(tokenAccountInfo.owner.toBase58() === TOKEN_PROGRAM_ID.toBase58());
  });

  it("Token 2022 Program", async () => {
    const mint = new Keypair();
    const token = new Keypair();

    const transactionSignature = await program.methods
      .interface()
      .accounts({
        signer: wallet.publicKey,
        mint: mint.publicKey,
        token: token.publicKey,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .signers([mint, token])
      .rpc();
    console.log("Your transaction signature", transactionSignature);

    const mintAccountInfo = await connection.getAccountInfo(mint.publicKey);
    assert(
      mintAccountInfo.owner.toBase58() === TOKEN_2022_PROGRAM_ID.toBase58()
    );

    const tokenAccountInfo = await connection.getAccountInfo(token.publicKey);
    assert(
      tokenAccountInfo.owner.toBase58() === TOKEN_2022_PROGRAM_ID.toBase58()
    );
  });
});
