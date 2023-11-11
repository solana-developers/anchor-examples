use anchor_lang::prelude::*;
use anchor_spl::token_interface::TokenInterface;

declare_id!("EKHAW46PDD4TiJnke4ofM5FpqsVT3pg6xsoB9X9TBuK4");

#[program]
pub mod example {
    use super::*;

    pub fn interface(ctx: Context<InterfaceType>) -> Result<()> {
        msg!("Program A: {:}", ctx.accounts.program_a.key());
        msg!("Program B: {:}", ctx.accounts.program_b.key());
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InterfaceType<'info> {
    pub program_a: Interface<'info, TokenInterface>,
    pub program_b: Interface<'info, TokenInterface>,
}
