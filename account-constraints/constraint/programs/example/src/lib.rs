use anchor_lang::prelude::*;

declare_id!("2Nn3NdMq7PZaP4VKRF6UV1HsQtPVcpWxoXR14ETw1Cw2");

#[program]
pub mod example {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, input: u64) -> Result<()> {
        msg!("Initialize data to: {}", input);
        ctx.accounts.new_account.data = input;
        Ok(())
    }

    pub fn custom_constraint(_ctx: Context<CustomConstraint>) -> Result<()> {
        msg!("Custom constraint passed!");
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
    pub new_account: Account<'info, DataAccount>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CustomConstraint<'info> {
    #[account(constraint = one.data == two.data)]
    pub one: Account<'info, DataAccount>,
    pub two: Account<'info, DataAccount>,
}

#[account]
pub struct DataAccount {
    data: u64, 
}
