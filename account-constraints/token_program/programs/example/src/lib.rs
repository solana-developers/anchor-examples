use anchor_lang::prelude::*;
use anchor_spl::token_interface::{Mint, TokenInterface};

declare_id!("4ZJfr7EgffCcn1ppamoz2LrSyW7oqnB94y1Am6oDoHFy");

#[program]
pub mod example {
    use super::*;

    pub fn token_program(ctx: Context<TokenProgram>) -> Result<()> {
        msg!(
            "Mint account program owner: {:?}",
            ctx.accounts.mint.to_account_info().owner
        );
        Ok(())
    }
}

#[derive(Accounts)]
pub struct TokenProgram<'info> {
    #[account(
        mint::token_program = token_program
    )]
    pub mint: InterfaceAccount<'info, Mint>,
    pub token_program: Interface<'info, TokenInterface>,
}
