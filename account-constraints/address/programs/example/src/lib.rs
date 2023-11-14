use anchor_lang::prelude::*;
use solana_program::pubkey;

declare_id!("EctM2BxTHWrWcuG8wJahLUB1EfKHmpp2Q5Y81oTZhNEV");

// Hardcoded pubkey for the address constraint example
const HARDCODED_PUBKEY: Pubkey = pubkey!("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");

#[program]
pub mod example {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, input: u64) -> Result<()> {
        msg!("Initialize data to: {}!", input);
        ctx.accounts.new_account.data = input;
        ctx.accounts.new_account.pubkey = ctx.accounts.signer.key();
        Ok(())
    }

    pub fn update(ctx: Context<Update>, input: u64) -> Result<()> {
        msg!("Changed data to: {}!", input);
        ctx.accounts.existing_account.data = input;
        Ok(())
    }

    pub fn hardcoded_address(ctx: Context<HardcodedAddress>) -> Result<()> {
        msg!("Address: {}", ctx.accounts.account.key());
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
        space = 8 + 8 + 32
    )]
    pub new_account: Account<'info, DataAccount>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(address = existing_account.pubkey)]
    pub signer: Signer<'info>,
    #[account(mut)]
    pub existing_account: Account<'info, DataAccount>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct HardcodedAddress<'info> {
    /// CHECK: address constraint example
    #[account(address = HARDCODED_PUBKEY)]
    pub account: UncheckedAccount<'info>,
}


#[account]
pub struct DataAccount {
    data: u64, // 8 bytes
    pubkey: Pubkey, // 32 bytes
}
