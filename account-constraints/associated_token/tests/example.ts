import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Example } from "../target/types/example";
import {
  createMint,
  getAccount,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import assert from "assert";

describe("example", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const wallet = provider.wallet as anchor.Wallet;
  const connection = provider.connection;

  const program = anchor.workspace.Example as Program<Example>;

  it("Is initialized!", async () => {
    // Create new mint account
    const mint = await createMint(
      connection,
      wallet.payer, // payer
      wallet.publicKey, // mint authority
      null, // freeze authority
      2 // decimals
    );

    // Derive associated token account address
    const associatedTokenAddress = getAssociatedTokenAddressSync(
      mint,
      wallet.publicKey
    );

    // Create associated token account via a cross program invocation (CPI)
    const transactionSignature = await program.methods
      .initialize()
      .accounts({
        signer: wallet.publicKey,
        associatedToken: associatedTokenAddress,
        mint: mint,
      })
      .rpc();

    console.log("Your transaction signature", transactionSignature);

    const tokenAccount = await getAccount(connection, associatedTokenAddress);
    assert(tokenAccount.mint.toBase58() == mint.toBase58());
    assert(tokenAccount.owner.toBase58() == wallet.publicKey.toBase58());
  });
});
