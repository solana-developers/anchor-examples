import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Example } from "../target/types/example";
import { Keypair, SystemProgram } from "@solana/web3.js";
import assert from "assert";

describe("example", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const wallet = provider.wallet as anchor.Wallet;

  const program = anchor.workspace.Example as Program<Example>;

  // Generate keypair for the new account
  const newAccountKp = new Keypair();

  // Instruction data
  const input = new anchor.BN(42);

  it("Is initialized!", async () => {
    const transactionSignature = await program.methods
      .initialize(input)
      .accounts({
        signer: wallet.publicKey,
        newAccount: newAccountKp.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([newAccountKp])
      .rpc();

    console.log("Your transaction signature", transactionSignature);

    // Fetch the newly created account
    const accountData = await program.account.newAccount.fetch(
      newAccountKp.publicKey
    );

    assert(accountData.data.eq(input));
  });

  it("Already initialized, expect fail", async () => {
    try {
      await program.methods
        .initialize(input)
        .accounts({
          signer: wallet.publicKey,
          newAccount: newAccountKp.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([newAccountKp])
        .rpc();
    } catch (error) {
      // Expect transaction to fail, return custom error message
      assert.strictEqual(
        error.error.errorMessage,
        "Account already Initialized"
      );
    }
  });
});
