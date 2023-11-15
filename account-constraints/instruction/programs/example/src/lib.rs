use anchor_lang::prelude::*;

declare_id!("6gXWxBEwz9eH1nhVdrCgUPwpWxtoSdkpu2oNqzNoAj2v");

#[program]
pub mod example {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, input: String) -> Result<()> {
        msg!("Initialize data to: {}", input);
        ctx.accounts.new_account.data = input;
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(input: String)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        init, 
        payer = signer, 
        space = 8 + 4 + input.len(),
    )]
    pub new_account: Account<'info, DataAccount>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct DataAccount {
    data: String, 
}
