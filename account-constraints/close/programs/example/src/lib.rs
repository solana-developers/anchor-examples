use anchor_lang::prelude::*;

declare_id!("2af6jzta3QUosZ84Z6GdvMChWzZdEY3KHzkDUNTUMjRy");

#[program]
pub mod example {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, input: u64) -> Result<()> {
        msg!("Initialize data to: {}", input);
        ctx.accounts.new_account.data = input;
        Ok(())
    }

    pub fn close(_ctx: Context<Close>) -> Result<()> {
        msg!("Account closed");
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
        space = 8 + 8,
    )]
    pub new_account: Account<'info, DataAccount>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Close<'info> {
    pub signer: Signer<'info>,
    #[account(
        mut,
        close = signer,
    )]
    pub existing_account: Account<'info, DataAccount>,
}

#[account]
pub struct DataAccount {
    data: u64, 
}
