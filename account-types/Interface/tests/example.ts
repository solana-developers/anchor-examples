import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Example } from "../target/types/example";
import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";

describe("example", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Example as Program<Example>;

  it("Token Program Interface", async () => {
    // Add your test here.
    const transactionSignature = await program.methods
      .interface()
      .accounts({
        programA: TOKEN_PROGRAM_ID,
        programB: TOKEN_2022_PROGRAM_ID,
      })
      .rpc();
    console.log("Your transaction signature", transactionSignature);
  });

  it("Swap Token 22 and Token Programs", async () => {
    // Add your test here.
    const transactionSignature = await program.methods
      .interface()
      .accounts({
        programA: TOKEN_2022_PROGRAM_ID,
        programB: TOKEN_PROGRAM_ID,
      })
      .rpc();
    console.log("Your transaction signature", transactionSignature);
  });
});
