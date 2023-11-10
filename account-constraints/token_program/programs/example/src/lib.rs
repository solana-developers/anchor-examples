use anchor_lang::prelude::*;
use anchor_spl::token_interface::{Mint, TokenInterface};

declare_id!("4ZJfr7EgffCcn1ppamoz2LrSyW7oqnB94y1Am6oDoHFy");

#[program]
pub mod example {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Created Mint Account: {}", ctx.accounts.mint.key());
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
        mint::decimals = 9,
        mint::authority = signer,
        mint::freeze_authority = signer,
        mint::token_program = token_program
    )]
    pub mint: InterfaceAccount<'info, Mint>,
    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
}
