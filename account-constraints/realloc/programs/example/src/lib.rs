use anchor_lang::prelude::*;

declare_id!("8owLmone5oQWwAZPKeYEmMciBg8Q533UcHBjcU6niV9E");

#[program]
pub mod example {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, input: String) -> Result<()> {
        msg!("Initialize data to: {}", input);
        ctx.accounts.new_account.data = input;
        Ok(())
    }

    pub fn realloc(ctx: Context<Realloc>, input: String) -> Result<()> {
        msg!("Update data to: {}", input);
        ctx.accounts.existing_account.data = input;

        let data_size = ctx.accounts.existing_account.data.len();
        msg!("Account Data Size: {}", data_size);
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(input: String)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        init, 
        payer = signer, 
        space = 8 + 4 + input.len(),
    )]
    pub new_account: Account<'info, DataAccount>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(input: String)]
pub struct Realloc<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        mut,
        realloc = 8 + 4 + input.len(),
        realloc::payer = signer,
        realloc::zero = false,
    )]
    pub existing_account: Account<'info, DataAccount>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct DataAccount {
    data: String, 
}
