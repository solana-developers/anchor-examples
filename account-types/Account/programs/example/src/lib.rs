use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, TokenAccount};
declare_id!("Dz6vPQaHBBDSMV1mk1RxodVaBhwJHZ8CD2J5HEjawM2e");

#[program]
pub mod example {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, input: u64) -> Result<()> {
        ctx.accounts.new_account.data = input;
        msg!("Changed data to: {}!", input);
        Ok(())
    }

    // Access the deserialize account data
    pub fn account_type(ctx: Context<AccountType>) -> Result<()> {
        // Custom Account
        msg!("Custom Account Data: {}", ctx.accounts.existing_account.data);

        // SPL Token Account
        msg!("Token Account Owner: {}", ctx.accounts.token.owner);
        msg!("Token Account Mint: {}", ctx.accounts.token.mint);
        msg!("Token Account Amount: {}", ctx.accounts.token.amount);

        // SPL Token Mint
        msg!("Token Mint Mint Authority: {:?}", ctx.accounts.mint.mint_authority);
        msg!("Token Mint Freeze Authority: {:?}", ctx.accounts.mint.freeze_authority);
        msg!("Token Mint Supply: {}", ctx.accounts.mint.supply);

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
        space = 8 + 8
    )]
    pub new_account: Account<'info, CustomAccount>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AccountType<'info> {
    pub existing_account: Account<'info, CustomAccount>,
    pub token: Account<'info, TokenAccount>,
    pub mint: Account<'info, Mint>,
}

#[account]
pub struct CustomAccount {
    data: u64,
}

