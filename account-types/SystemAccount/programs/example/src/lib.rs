use anchor_lang::prelude::*;

declare_id!("5RoDG2t9Vcdy2oqHzjFLSACD7KjwbP9wVErC38vf5v3x");

#[program]
pub mod example {
    use super::*;

    pub fn system_account(ctx: Context<SystemAccountType>) -> Result<()> {
        msg!("System Account: {}", ctx.accounts.system_account.key());
        msg!(
            "System Account Owner: {}",
            ctx.accounts.system_account.owner
        );
        Ok(())
    }
}

#[derive(Accounts)]
pub struct SystemAccountType<'info> {
    pub system_account: SystemAccount<'info>,
}
