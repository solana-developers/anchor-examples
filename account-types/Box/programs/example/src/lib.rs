use anchor_lang::prelude::*;

declare_id!("6VjCLRZJY9wg7wsZ7sPxSmAuY48AtWcZ53BK545dD5kV");

#[program]
pub mod example {
    use super::*;

    pub fn initialize_box(_ctx: Context<InitializeBox>) -> Result<()> {
        Ok(())
    }

    // This instruction will always fail
    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeBox<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        init, 
        payer = signer, 
        space = 8 + 2000
    )]
    pub new_account: Box<Account<'info, DataAccount>>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        init, 
        payer = signer, 
        space = 8 + 2000
    )]
    pub new_account: Account<'info, DataAccount>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct DataAccount {
    data: [u8; 2000],
}
