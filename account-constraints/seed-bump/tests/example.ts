import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Example } from "../target/types/example";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import assert from "assert";

describe("example", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const wallet = provider.wallet as anchor.Wallet;

  const program = anchor.workspace.Example as Program<Example>;

  // PDA we will use as the address of the account we will create
  const [pda, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from("seed"), wallet.publicKey.toBuffer()],
    program.programId
  );

  it("Create account using PDA as address", async () => {
    // Instruction data
    const input = new anchor.BN(42);

    // Send transaction to initialize the new account
    const transactionSignature = await program.methods
      .initialize(input)
      .accounts({
        signer: wallet.publicKey,
        newAccount: pda,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log("Your transaction signature", transactionSignature);

    // Fetch the newly created account
    const accountData = await program.account.dataAccount.fetch(pda);

    assert(accountData.data.eq(input));
    assert(accountData.bump == bump);
  });

  it("Update the data stored on the PDA account", async () => {
    // Instruction data
    const input = new anchor.BN(24);

    // Send transaction to initialize the new account
    const transactionSignature = await program.methods
      .update(input)
      .accounts({
        signer: wallet.publicKey,
        existingAccount: pda,
      })
      .rpc();

    console.log("Your transaction signature", transactionSignature);

    // Fetch the newly created account
    const accountData = await program.account.dataAccount.fetch(pda);

    assert(accountData.data.eq(input));
    assert(accountData.bump == bump);
  });
});
