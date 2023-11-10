use anchor_lang::prelude::*;

declare_id!("7ZpxAfW6xKiGLjyvvUPB71HQKWTqs3VdeYTY5uT784VE");

#[program]
pub mod example {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, input: u64) -> Result<()> {
        require!(
            !ctx.accounts.new_account.is_initialized,
            MyError::AlreadyInitialized
        );
        ctx.accounts.new_account.is_initialized = true;
        ctx.accounts.new_account.data = input;
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
    pub new_account: Account<'info, NewAccount>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct NewAccount {
    is_initialized: bool, // 1 byte
    data: u64, // 8 bytes
}

#[error_code]
pub enum MyError {
    #[msg("Account already Initialized")]
    AlreadyInitialized,
}
