import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Example } from "../target/types/example";
import { Keypair } from "@solana/web3.js";
import assert from "assert";

describe("example", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const wallet = provider.wallet as anchor.Wallet;

  const program = anchor.workspace.Example as Program<Example>;

  it("Is initialized!", async () => {
    // Generate keypair for the new account
    const newAccountKp = new Keypair();

    // Instruction data
    const input = new anchor.BN(42);

    const transactionSignature = await program.methods
      .initialize(input)
      .accounts({
        signer: wallet.publicKey,
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
  });
});
