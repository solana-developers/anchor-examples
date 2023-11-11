use anchor_lang::prelude::*;

declare_id!("FuACQ49TzPjXDBWjjvu6wi2hwsxxTqAoZVaJEVzTho98");

#[program]
pub mod example {
    use super::*;

    pub fn optional_account(ctx: Context<OptionalAccount>) -> Result<()> {
        msg!("Required Account: {}", ctx.accounts.required_account.key());

        if let Some(optional_account) = &ctx.accounts.optional_account {
            msg!("Optional Account: {}", optional_account.key());
        } else {
            msg!("Optional Account is not provided");
        }
        Ok(())
    }
}

#[derive(Accounts)]
pub struct OptionalAccount<'info> {
    pub required_account: SystemAccount<'info>,
    pub optional_account: Option<SystemAccount<'info>>,
}
