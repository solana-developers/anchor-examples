import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Example } from "../target/types/example";
import { SYSVAR_CLOCK_PUBKEY } from "@solana/web3.js";

describe("example", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Example as Program<Example>;

  it("Sysvar Clock", async () => {
    // Add your test here.
    const tx = await program.methods
      .sysvarAccount()
      .accounts({
        sysvarClock: SYSVAR_CLOCK_PUBKEY,
      })
      .rpc();
    console.log("Your transaction signature", tx);
  });
});
