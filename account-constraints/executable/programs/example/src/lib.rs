use anchor_lang::prelude::*;

declare_id!("6sW3NjEvTR522dA94Lv8kLcqaSM2fdEbTGSjaaFuvJd7");

#[program]
pub mod example {
    use super::*;

    pub fn executable_constraint(ctx: Context<ExecutableConstraint>) -> Result<()> {
        msg!(
            "executable program: {}",
            ctx.accounts.program_account.executable
        );
        Ok(())
    }
}

#[derive(Accounts)]
pub struct ExecutableConstraint<'info> {
    /// CHECK: executable constraint example, check account is executable program
    #[account(executable)]
    pub program_account: UncheckedAccount<'info>,
}
