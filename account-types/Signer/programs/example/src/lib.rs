use anchor_lang::prelude::*;

declare_id!("AUffEiJB7q81Zww8ireHXdncMef53kyvqpPiPMo9iD5u");

#[program]
pub mod example {
    use super::*;

    pub fn signers(ctx: Context<Signers>) -> Result<()> {
        msg!(
            "Address: {}, Is Signer: {}",
            ctx.accounts.signer.key(),
            ctx.accounts.signer.is_signer
        );
        msg!(
            "Address: {}, Is Signer: {}",
            ctx.accounts.signer2.key(),
            ctx.accounts.signer2.is_signer
        );
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Signers<'info> {
    pub signer: Signer<'info>,
    pub signer2: Signer<'info>,
}
