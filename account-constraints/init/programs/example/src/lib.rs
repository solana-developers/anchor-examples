use anchor_lang::prelude::*;

declare_id!("2TiUn4ZNzQsSgwMnfD1fpzXNrBmqqB8BYeDF4xVb5WcF");

#[program]
pub mod example {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, input: u64) -> Result<()> {
        ctx.accounts.new_account.data = input;
        msg!("Changed data to: {}!", input);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        init, 
        payer = signer, 
        space = 8 + 8
    )]
    pub new_account: Account<'info, DataAccount>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct DataAccount {
    data: u64,
}
