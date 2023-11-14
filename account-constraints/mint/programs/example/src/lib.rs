use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token};

declare_id!("3bA9ovdNzycPGkdF8Pt31gxkV4BNzgZ2iKhWTpF5FcME");

#[program]
pub mod example {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Created Mint Account: {}", ctx.accounts.mint.key());
        Ok(())
    }

    pub fn account_validation(ctx: Context<AccountValidation>) -> Result<()> {
        // Checked that `signer` is the both mint and freeze authority of `mint
        msg!("Mint : {}", ctx.accounts.mint.key());
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
        mint::freeze_authority = signer
    )]
    pub mint: Account<'info, Mint>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AccountValidation<'info> {
    pub signer: Signer<'info>,
    #[account(
        mint::authority = signer,
        mint::freeze_authority = signer
    )]
    pub mint: Account<'info, Mint>,
}
