use anchor_lang::prelude::*;
use anchor_lang::system_program::{transfer, Transfer};

declare_id!("rVud42FewGc791sB1a3nFiqd2mHrDojYMFBKBT6pBgM");

#[program]
pub mod example {
    use super::*;

    pub fn mut_constraint(ctx: Context<MutConstraint>, amount: u64) -> Result<()> {
        // transfer SOL via a Cross Program Invocation (CPI),
        // both the `from` and `to` accounts must be mutable
        transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.from.to_account_info(),
                    to: ctx.accounts.to.to_account_info(),
                },
            ),
            amount,
        )?;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct MutConstraint<'info> {
    #[account(mut)]
    pub from: Signer<'info>,
    #[account(mut)]
    pub to: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}
