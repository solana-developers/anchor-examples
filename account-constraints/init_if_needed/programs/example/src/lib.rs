use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, Token, TokenAccount},
};

declare_id!("7ZpxAfW6xKiGLjyvvUPB71HQKWTqs3VdeYTY5uT784VE");

#[program]
pub mod example {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, input: u64) -> Result<()> {
        if ctx.accounts.new_account.is_initialized {
            msg!("Already initialized, data unchanged");
        } else {
            ctx.accounts.new_account.is_initialized = true;
            ctx.accounts.new_account.data = input;
            msg!("Initializing account with data: {}", input);
        }
        Ok(())
    }

    pub fn initialize_token_account(ctx: Context<InitializeTokenAccount>) -> Result<()> {
        // No additional checks needed, token account checks are done by token program
        msg!("Initialize associated token account if needed");
        msg!("Associated token account: {}", ctx.accounts.associated_token.key());
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        init_if_needed, 
        payer = signer, 
        space = 8 + 1 + 8
    )]
    pub new_account: Account<'info, DataAccount>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitializeTokenAccount<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        init_if_needed,
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

#[account]
pub struct DataAccount {
    is_initialized: bool, // 1 byte
    data: u64, // 8 bytes
}