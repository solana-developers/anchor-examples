use anchor_lang::prelude::*;

declare_id!("73sPJMosq8gyYgJZKQsTKZQJTchH3uc2SKxiCL1mzsj3");

#[program]
pub mod example {
    use super::*;

    pub fn signer_constraint(_ctx: Context<SignerConstraint>) -> Result<()> {
        msg!("Passed signer constraint checked!");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct SignerConstraint<'info> {
    /// CHECK: signer constraint example
    #[account(signer)]
    pub signer: UncheckedAccount<'info>,
}
