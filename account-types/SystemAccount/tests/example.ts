import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Example } from "../target/types/example";
import { SystemProgram, Keypair } from "@solana/web3.js";
import assert from "assert";

describe("example", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const wallet = provider.wallet as anchor.Wallet;

  const program = anchor.workspace.Example as Program<Example>;

  it("Use provider wallet", async () => {
    const transactionSignature = await program.methods
      .systemAccount()
      .accounts({ systemAccount: wallet.publicKey })
      .rpc();
    console.log("Your transaction signature", transactionSignature);
  });

  it("Use random keypair", async () => {
    // new keypairs are by default system accounts
    const randomKeypair = new Keypair();

    const transactionSignature = await program.methods
      .systemAccount()
      .accounts({ systemAccount: randomKeypair.publicKey })
      .rpc();
    console.log("Your transaction signature", transactionSignature);
  });

  it("Use System Program, expect fail", async () => {
    try {
      await program.methods
        .systemAccount()
        .accounts({ systemAccount: SystemProgram.programId })
        .rpc();
    } catch (error) {
      assert.strictEqual(
        error.message,
        "AnchorError caused by account: system_account. Error Code: AccountNotSystemOwned. Error Number: 3011. Error Message: The given account is not owned by the system program."
      );
    }
  });
});
