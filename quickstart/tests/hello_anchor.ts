import * as anchor from "@coral-xyz/anchor";
import { Program, BN } from "@coral-xyz/anchor";
import { HelloAnchor } from "../target/types/hello_anchor";
import { Keypair, SystemProgram } from "@solana/web3.js";
import assert from "assert";

describe("hello_anchor", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const wallet = provider.wallet as anchor.Wallet;
  const connection = provider.connection;

  const program = anchor.workspace.HelloAnchor as Program<HelloAnchor>;

  it("initialize", async () => {
    // Generate keypair for the new account
    const newAccountKp = new Keypair();

    // Send transaction
    const data = new BN(42);
    const txHash = await program.methods
      .initialize(data)
      .accounts({
        newAccount: newAccountKp.publicKey,
        signer: wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([newAccountKp])
      .rpc();
    console.log(`Use 'solana confirm -v ${txHash}' to see the logs`);

    // Confirm transaction
    await connection.confirmTransaction(txHash);

    // Fetch the created account
    const newAccount = await program.account.newAccount.fetch(
      newAccountKp.publicKey
    );

    console.log("On-chain data is:", newAccount.data.toString());

    // Check whether the data on-chain is equal to local 'data'
    assert(data.eq(newAccount.data));
  });
});
