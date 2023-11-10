use anchor_lang::prelude::*;
use solana_program::pubkey;

declare_id!("EctM2BxTHWrWcuG8wJahLUB1EfKHmpp2Q5Y81oTZhNEV");

// Hardcoded pubkey for the address constraint example
const HARDCODED_PUBKEY: Pubkey = pubkey!("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");

#[program]
pub mod example {
    use super::*;

    pub fn address_constraint(ctx: Context<AddressConstraint>) -> Result<()> {
        msg!("Address: {}", ctx.accounts.address.key());
        Ok(())
    }
}

#[derive(Accounts)]
pub struct AddressConstraint<'info> {
    /// CHECK: address constraint example
    #[account(address = HARDCODED_PUBKEY)]
    pub address: UncheckedAccount<'info>,
}
