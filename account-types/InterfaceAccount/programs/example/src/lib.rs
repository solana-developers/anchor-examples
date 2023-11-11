use anchor_lang::prelude::*;
use anchor_spl::token_interface::{Mint, TokenAccount, TokenInterface};

declare_id!("9bwt8Ma6hdK9bmM7b3kdqbzc9K1YJQygSjnAuZKWSEL5");

#[program]
pub mod example {
    use super::*;

    pub fn interface(ctx: Context<InterfaceType>) -> Result<()> {
        msg!("Mint Account Program Owner: {:}", ctx.accounts.mint.to_account_info().owner.key());
        msg!("Token Account Program Owner: {:}", ctx.accounts.token.to_account_info().owner.key());
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InterfaceType<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        init,
        payer = signer,
        mint::decimals = 9,
        mint::authority = signer,
        mint::freeze_authority = signer,
        mint::token_program = token_program,
    )]
    pub mint: InterfaceAccount<'info, Mint>,
    #[account(
        init,
        payer = signer,
        token::mint = mint, 
        token::authority = signer,
    )]
    pub token: InterfaceAccount<'info, TokenAccount>,
    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
}
