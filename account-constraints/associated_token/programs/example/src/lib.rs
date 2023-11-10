use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, Token, TokenAccount},
};

declare_id!("BQJrDLm7z8NPnE45oNLfWXDzudhBHSDWTsKadxmU4FYE");

#[program]
pub mod example {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!(
            "Created Associated Token Account: {}",
            ctx.accounts.associated_token.key()
        );
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
        associated_token::mint = mint,
        associated_token::authority = signer,
    )]
    pub associated_token: Account<'info, TokenAccount>,
    pub mint: Account<'info, Mint>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}
