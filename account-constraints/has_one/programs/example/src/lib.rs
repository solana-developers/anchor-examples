use anchor_lang::prelude::*;

declare_id!("ADzbsKXNu2cYbQkSMYfYmnXZ9oGyYATKa6gv8DRsPqYv");

#[program]
pub mod example {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, input: u64) -> Result<()> {
        ctx.accounts.new_account.data = input;
        ctx.accounts.new_account.authority = *ctx.accounts.authority.key;
        msg!("Initialize data to: {}", input);
        msg!("Authority: {}", ctx.accounts.authority.key);
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
    pub authority: Signer<'info>,
    #[account(
        init, 
        payer = authority, 
        space = 8 + 8 + 32,
    )]
    pub new_account: Account<'info, DataAccount>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Update<'info> {
    pub authority: Signer<'info>,
    #[account(
        mut,
        has_one = authority,
    )]
    pub existing_account: Account<'info, DataAccount>,
}

#[account]
pub struct DataAccount {
    data: u64, // 8 bytes
    authority: Pubkey, // 32 bytes
}
