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

  // Keypairs for the accounts we will create
  const accountOne = new Keypair();
  const accountTwo = new Keypair();
  const accountThree = new Keypair();

  // Instruction data to initialize accounts with
  // Accounts one and two will use inputOne, Account three will use inputTwo
  const inputOne = new anchor.BN(1);
  const inputTwo = new anchor.BN(2);

  it("Create accounts", async () => {
    // Create account one
    await program.methods
      .initialize(inputOne)
      .accounts({
        signer: wallet.publicKey,
        newAccount: accountOne.publicKey,
      })
      .signers([accountOne])
      .rpc();

    // Create account two
    await program.methods
      .initialize(inputOne)
      .accounts({
        signer: wallet.publicKey,
        newAccount: accountTwo.publicKey,
      })
      .signers([accountTwo])
      .rpc();

    // Create account three
    await program.methods
      .initialize(inputTwo)
      .accounts({
        signer: wallet.publicKey,
        newAccount: accountThree.publicKey,
      })
      .signers([accountThree])
      .rpc();
  });

  it("Test custom constraint", async () => {
    const transactionSignature = await program.methods
      .customConstraint()
      .accounts({
        one: accountOne.publicKey,
        two: accountTwo.publicKey,
      })
      .rpc();

    console.log("Your transaction signature", transactionSignature);
  });

  it("Violate custom constraint, expect fail", async () => {
    try {
      await program.methods
        .customConstraint()
        .accounts({
          one: accountOne.publicKey,
          two: accountThree.publicKey,
        })
        .rpc();
    } catch (error) {
      assert.strictEqual(
        error.error.errorMessage,
        "A raw constraint was violated"
      );
    }
  });
});
