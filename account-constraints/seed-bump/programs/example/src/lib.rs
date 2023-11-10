use anchor_lang::prelude::*;

declare_id!("5hcpj5ic2YFnUBgLurXJkdi5o8G9vUfjZJNhCw2pKpuE");

#[program]
pub mod example {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, input: u64) -> Result<()> {
        ctx.accounts.new_account.data = input;
        ctx.accounts.new_account.bump = ctx.bumps.new_account;
        msg!("Initialize data to: {}", input);
        msg!("PDA bump seed: {}", ctx.bumps.new_account);
        Ok(())
    }

    pub fn update(ctx: Context<Update>, input: u64) -> Result<()> {
        ctx.accounts.existing_account.data = input;
        msg!("Update data to: {}", input);
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
        space = 8 + 8 + 1,
        seeds = [b"seed", signer.key().as_ref()], 
        bump
    )]
    pub new_account: Account<'info, DataAccount>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Update<'info> {
    pub signer: Signer<'info>,
    #[account(
        mut,
        seeds = [b"seed", signer.key().as_ref()], 
        bump = existing_account.bump
    )]
    pub existing_account: Account<'info, DataAccount>,
}

#[account]
pub struct DataAccount {
    data: u64, // 8 bytes
    bump: u8,  // 1 byte
}
