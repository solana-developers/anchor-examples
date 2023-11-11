use anchor_lang::prelude::*;

declare_id!("BK6ccjF2GDtTKuypdgJZbFyVCSXJYo85sMY6jniiMsCg");

#[program]
pub mod example {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, input: u64) -> Result<()> {
        let new_account = &mut ctx.accounts.new_account.load_init()?;
        new_account.data = input;

        msg!("Initialize data to: {}", input);
        Ok(())
    }

    pub fn update(ctx: Context<Update>, input: u64) -> Result<()> {
        let existing_account = &mut ctx.accounts.existing_account.load_mut()?;
        existing_account.data = input;

        msg!("Updated data to: {}", input);
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
        space = 8 + 8,
    )]
    pub new_account: AccountLoader<'info, DataAccount>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut)]
    pub existing_account: AccountLoader<'info, DataAccount>,
}

#[account(zero_copy)]
pub struct DataAccount {
    data: u64,
}
